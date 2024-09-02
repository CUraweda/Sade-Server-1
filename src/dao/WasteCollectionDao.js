const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const WasteCollection = models.wastecollection;
const StudentClass = models.studentclass;
const Students = models.students;
const WeekDay = models.weekday;
const Classes = models.classes;
const WasteTypes = models.wastetypes;

class WasteCollectionDao extends SuperDao {
  constructor() {
    super(WasteCollection);
  }

  //Rekap data untuk kebutuhan dashboard selama 1 tahun ajaran
  async recapStudentClass(id) {
    const collection = await WasteCollection.findAll({
      where: {
        "$studentclass.student_id$": id,
      },
      include: [
        {
          model: StudentClass,
          attributes: [],
          include: [
            {
              model: Students,
              attributes: [],
            },
            {
              model: Classes,
              attributes: [],
            },
          ],
        },
      ],
      attributes: [
        [sequelize.col("studentclass.student_id"), "student_id"],
        [sequelize.col("studentclass.student.full_name"), "full_name"],
        [sequelize.col("studentclass.class_id"), "class_id"],
        [sequelize.col("studentclass.class.class_name"), "class_name"],
        [sequelize.fn("SUM", sequelize.col("weight")), "total_weight"],
      ],
      group: ["WasteCollection.student_class_id"], // Correct the alias for grouping
    });

    const { class_id = 0 } = collection[0].dataValues;

    const target = await Classes.findOne({
      where: {
        id: class_id,
      },
    });
    collection[0].dataValues.target = target.waste_target;

    return [collection];
  }

  async recapHistoryByStudentId(id) {
    const studentId = id;

    const currentDate = new Date();
    const currentDateNumber = currentDate.getDate()
    const firstDayOfMonth = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1)).toISOString().split('T')[0] + "T00:00:00.000Z";
    const lastDayOfMonth = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)).toISOString().split('T')[0] + "T23:59:59.999Z";

    let data = { today: 0, this_month: 0 }
    const collections = await WasteCollection.findAll({
      where: {
        "$studentclass.student.id$": studentId,
        "$studentclass.student.is_active$": "Ya",
        collection_date: { [Op.between]: [firstDayOfMonth, lastDayOfMonth] }
      },
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students
            }
          ]
        }
      ]
    })

    for (let collection of collections) {
      data.this_month += collection.weight
      const date = collection.collection_date.getDate()
      if (date === currentDateNumber) data.today += collection.weight
    }

    return data
  }

  async getById(id) {
    return WasteCollection.findAll({
      where: { id },
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students,
            },
          ],
        },
      ],
    });
  }

  async getFilteredCount(filterOptions) {
    const whereClause = {};

    if (filterOptions.waste_type_id) {
      whereClause['waste_type_id'] = filterOptions.waste_type_id;
    }

    if (filterOptions.class_id) {
      whereClause['$studentclass.class_id$'] = filterOptions.class_id;
    }
    if (filterOptions.start_date && filterOptions.end_date) {
      const startDate = new Date(filterOptions.start_date);
      const endDate = new Date(filterOptions.end_date);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      whereClause['collection_date'] = {
        [Op.between]: [startDate, endDate]
      };
    } else if (filterOptions.start_date) {
      const startDate = new Date(filterOptions.start_date);
      startDate.setHours(0, 0, 0, 0);
      whereClause['collection_date'] = {
        [Op.gte]: startDate
      };
    } else if (filterOptions.end_date) {
      const endDate = new Date(filterOptions.end_date);
      endDate.setHours(23, 59, 59, 999);
      whereClause['collection_date'] = {
        [Op.lte]: endDate
      };
    }

    return WasteCollection.count({
      where: whereClause,
      include: [
        {
          model: StudentClass,
          as: 'studentclass',
          include: [
            {
              model: Students,
              as: 'student',
              attributes: ["nis", "full_name"]
            }
          ],
          attributes: ["*"]
        },
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: ["id", "code", "name", "price"]
        },
      ],
      order: [['collection_date', 'ASC']] // Adjust the sorting as per your requirements
    });
  }
  async getCount(search) {
    return WasteCollection.count({
      where: {
        [Op.or]: [
          {
            '$studentclass.student.nis$': {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            '$studentclass.student.full_name$': {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            collection_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            waste_type_id: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            weight: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentClass,
          as: 'studentclass',
          include: [
            {
              model: Students,
              as: 'student',
              attributes: ["nis", "full_name"]
            }
          ],
          attributes: ["*"]
        },
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: ["id", "code", "name", "price"]
        },
      ],
    });
  }
  async getWasteCollectionPage(search, offset, limit) {
    return WasteCollection.findAll({
      where: {
        [Op.or]: [
          {
            "$studentclass.student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentclass.student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            collection_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            waste_type_id: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            weight: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentClass,
          as: 'studentclass',
          include: [
            {
              model: Students,
              as: 'student',
              attributes: ["nis", "full_name", "class"]
            }
          ],
          attributes: ["id", "class_id"]
        },
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: ["id", "code", "name", "price"]
        },
      ],
      limit: limit,  // Add this line
      offset: offset  // Add this line
    });
  }

  async getByFilter(filterOptions, limit, offset) {
    const whereClause = {};

    if (filterOptions.waste_type_id) {
      whereClause['waste_type_id'] = filterOptions.waste_type_id;
    }

    if (filterOptions.class_id) {
      whereClause['$studentclass.class_id$'] = filterOptions.class_id;
    }
    if (filterOptions.start_date && filterOptions.end_date) {
      const startDate = new Date(filterOptions.start_date);
      const endDate = new Date(filterOptions.end_date);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      whereClause['collection_date'] = {
        [Op.between]: [startDate, endDate]
      };
    } else if (filterOptions.start_date) {
      const startDate = new Date(filterOptions.start_date);
      startDate.setHours(0, 0, 0, 0);
      whereClause['collection_date'] = {
        [Op.gte]: startDate
      };
    } else if (filterOptions.end_date) {
      const endDate = new Date(filterOptions.end_date);
      endDate.setHours(23, 59, 59, 999);
      whereClause['collection_date'] = {
        [Op.lte]: endDate
      };
    }

    return WasteCollection.findAll({
      where: whereClause,
      include: [
        {
          model: StudentClass,
          as: 'studentclass',
          attributes: ["id", "class_id"],
          include: [
            {
              model: Students,
              as: 'student',
              attributes: ["nis", "full_name", "class"]
            }
          ]
        },
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: ["id", "code", "name", "price"]
        }
      ],
      order: [['collection_date', 'ASC']],
      limit: limit,
      offset: offset
    });
  }
  async collectionPerWeekByStudentId(id) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    let startOfWeek = new Date(today);
    let endOfWeek = new Date(today);

    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust start of the week based on Sunday
    startOfWeek.setDate(diff);
    startOfWeek = startOfWeek.toISOString().split('T')[0] + "T00:00:00.000Z"

    const daysToAdd = 5 - dayOfWeek + (dayOfWeek === 0 ? 7 : 0); // Adjust end of the week based on Friday
    endOfWeek.setDate(today.getDate() + daysToAdd);
    endOfWeek = endOfWeek.toISOString().split('T')[0] + "T23:59:59.999Z"

    try {
      const wasteTypes = await WasteTypes.findAll({ raw: true });
      const weekdays = await WeekDay.findAll({ raw: true })

      let formatData = {}, weekdayFormat = {}
      for (let weekday of weekdays) weekdayFormat[weekday.name] = 0
      for (let wasteType of wasteTypes) {
        const rawWeekDay = weekdayFormat
        formatData[wasteType.id] = {
          waste_type: wasteType.name,
          weekday: { ...rawWeekDay }
        }
      }

      const collections = await this.getByDate(startOfWeek, endOfWeek, { student_class_id: id })
      for (let collection of collections){
        const { waste_type_id, weekday, weight } = collection
        if(!formatData[waste_type_id]) continue
        formatData[waste_type_id].weekday[weekday.name] += weight
      } 

      // const result = [];

      // for (const wasteType of wasteTypes) {
      //   const wasteTypeData = {
      //     waste_type: wasteType.name,
      //     weekday: {},
      //   };

      //   for (const weekday of weekdays) {
      //     const collection = await WasteCollection.findOne({
      //       where: {
      //         student_class_id: id,
      //         waste_type_id: wasteType.id,
      //         day_id: weekday.id,
      //       },
      //       attributes: [
      //         [sequelize.fn("SUM", sequelize.col("weight")), "totalWeight"], // Calculate total weight
      //       ],
      //       raw: true,
      //     });

      //     wasteTypeData.weekday[weekday.name.toLowerCase()] = collection
      //       ? collection.totalWeight || 0
      //       : 0;
      //   }

      //   result.push(wasteTypeData);
      // }

      return Object.values(formatData)
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }

    // const today = new Date();
    // const dayOfWeek = today.getDay();
    // const startOfWeek = new Date(today);
    // const endOfWeek = new Date(today);

    // const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust start of the week based on Sunday
    // startOfWeek.setDate(diff);

    // const daysToAdd = 5 - dayOfWeek + (dayOfWeek === 0 ? 7 : 0); // Adjust end of the week based on Friday
    // endOfWeek.setDate(today.getDate() + daysToAdd);

    // try {
    //   const wasteTypes = await WasteTypes.findAll({ raw: true });
    //   const weekdays = await WeekDay.findAll({ raw: true });

    //   const wasteData = [];

    //   // Generate combinations of waste types and weekdays
    //   for (const wasteType of wasteTypes) {
    //     for (const weekday of weekdays) {
    //       wasteData.push({
    //         waste_type: wasteType.name,
    //         weekday: weekday.name,
    //         weight: null, // Initialize weight as null
    //       });
    //     }
    //   }

    //   // Perform left join with waste collection data
    //   for (const data of wasteData) {
    //     const collection = await WasteCollection.findOne({
    //       where: {
    //         student_class_id: 25,
    //         collection_date: {
    //                     [Op.between]: [startOfWeek, endOfWeek],
    //                   },
    //         waste_type_id: wasteTypes.find((w) => w.name === data.waste_type)
    //           .id,
    //         day_id: weekdays.find((wd) => wd.name === data.weekday).id,
    //       },
    //       attributes: [
    //         [sequelize.fn("SUM", sequelize.col("weight")), "totalWeight"], // Calculate total weight
    //       ],
    //       raw: true,
    //     });

    //     data.weight = collection ? collection.totalWeight : 0;
    //   }

    //   return wasteData;
    // } catch (error) {
    //   console.error("Error:", error);
    //   throw error;
    // }

    // return WeekDay.findAll({
    //   attributes: [
    //     [sequelize.literal("weekday.name"), "name"],
    //     [sequelize.literal("wastecollections.waste_type"), "waste_type"],
    //     [sequelize.literal("wastecollections.weight"), "weight"],
    //   ],
    //   include: [
    //     {
    //       model: WasteCollection,
    //       attributes: [],
    //       required: false,
    //       include: [
    //         {
    //           model: StudentClass,
    //           // include: [
    //           //   {
    //           //     model: Students,
    //           //     attributes: [],
    //           //   },
    //           // ],
    //           attributes: [],
    //           required: true,
    //         },
    //       ],
    //       where: {
    //         "$wastecollections.studentclass.student_id$": id,
    //         "$wastecollections.studentclass.is_active$": "Ya",
    //         collection_date: {
    //           [Op.between]: [startOfWeek, endOfWeek],
    //         },
    //       },
    //     },
    //   ],
    //   order: [["id", "ASC"]],
    // });
  }

  async recapPerWeekByStudentId(id) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    let startOfWeek = new Date(today);
    let endOfWeek = new Date(today);

    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust start of the week based on Sunday
    startOfWeek.setDate(diff);
    startOfWeek = startOfWeek.toISOString().split('T')[0] + "T00:00:00.000Z"

    const daysToAdd = 5 - dayOfWeek + (dayOfWeek === 0 ? 7 : 0); // Adjust end of the week based on Friday
    endOfWeek.setDate(today.getDate() + daysToAdd);
    endOfWeek = endOfWeek.toISOString().split('T')[0] + "T23:59:59.999Z"

    const weekdays = await WeekDay.findAll()
    const collections = await WasteCollection.findAll({
      where: {
        "$studentclass.student_id$": id,
        "$studentclass.is_active$": "Ya",
        collection_date: { [Op.between]: [startOfWeek, endOfWeek] }
      },
      include: [
        {
          model: StudentClass
        }
      ]
    })

    let weekDatas = {}
    for (let weekday of weekdays) { weekDatas[weekday.id] = { name: weekday.name, weight: 0 } }
    for (let collection of collections) {
      const dayNumber = collection.collection_date.getDay()
      if(weekDatas[dayNumber]) weekDatas[dayNumber].weight += collection.weight
    }

    return weekDatas
    // return WeekDay.findAll({
    //   attributes: [
    //     [sequelize.literal("weekday.name"), "name"],
    //     [
    //       sequelize.fn("SUM", sequelize.literal("wastecollections.weight")),
    //       "weight",
    //     ],
    //   ],
    //   include: [
    //     {
    //       model: WasteCollection,
    //       attributes: [],
    //       required: false,
    //       include: [
    //         {
    //           model: StudentClass,
    //           attributes: [],
    //           required: true,
    //         },
    //       ],
    //       where: {
    //         "$wastecollections.studentclass.student_id$": id,
    //         "$wastecollections.studentclass.is_active$": "Ya",
    //         collection_date: {
    //           [Op.between]: [startOfWeek, endOfWeek],
    //         },
    //       },
    //     },
    //   ],
    //   order: [["id", "ASC"]],
    //   group: ["name"],
    // });
  }

  async targetAchievement(id, is_current) {
    const currentDate = new Date();
    let currentMonthStart = new Date();
    let currentMonthEnd = new Date();

    if (is_current === "1") {
      currentMonthStart = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1)).toISOString().split('T')[0] + "T00:00:00.000Z";
      currentMonthEnd = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)).toISOString().split('T')[0] + "T23:59:59.999Z";
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() - 1; // Subtract 1 to get the previous month
      const day = 1; // Set the day to 1 to get the first day of the month

      // Handling edge case where the current month is January
      if (month === -1) {
        year = year - 1; // Subtract 1 from the year
        month = 11; // Set month to December (since January is 0, December is 11)
      }

      currentMonthStart = new Date(year, month, day);
      currentMonthEnd = new Date(year, month + 1, 0);
    }


    return WasteCollection.findAll({
      where: {
        "$studentclass.student_id$": id,
        collection_date: {
          [Op.between]: [currentMonthStart, currentMonthEnd],
        },
      },
      include: [
        {
          model: StudentClass,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: Classes,
              attributes: ["waste_target"],
            },
          ],
        },
      ],
      attributes: [
        [sequelize.fn("SUM", sequelize.literal("weight")), "weight"],
      ],
      group: ["student_class_id"],
    });

  }

  async getTotalWeight(startDate, endDate) {
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.collection_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.collection_date = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.collection_date = {
        [Op.lte]: new Date(endDate)
      };
    }

    const result = await WasteCollection.sum('weight', { where: whereClause });
    return result;
  }


  async getByDate(start, end, filter) {
    const { student_class_id } = filter
    return WasteCollection.findAll({
      where: {
        student_class_id,
        collection_date: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: WeekDay
        }
      ]
    })
  }
}
module.exports = WasteCollectionDao;
