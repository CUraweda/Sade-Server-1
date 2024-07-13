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
    const DateNowStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate().toString().padStart(2, "0"),
      0,
      0,
      0
    );
    console.log(currentDate);
    console.log(currentDate.getDay());
    const DateNowEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate().toString().padStart(2, "0"),
      23,
      59,
      59
    );
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    return WasteCollection.findAll({
      attributes: [
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "DISTINCT CASE WHEN DATE(`wastecollection`.`collection_date`) BETWEEN :nowStart AND :nowEnd THEN weight END"
            )
          ),
          "today",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "DISTINCT CASE WHEN DATE(`wastecollection`.`collection_date`) BETWEEN :startDate AND :endDate THEN `weight` END"
            )
          ),
          "this_month",
        ],
      ],
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students,
            },
          ],
          attributes: [],
        },
      ],
      where: {
        "$studentclass.student.id$": studentId,
        "$studentclass.student.is_active$": "Ya",
      },
      group: ["student_class_id"],
      replacements: {
        nowStart: DateNowStart,
        nowEnd: DateNowEnd,
        startDate: firstDayOfMonth,
        endDate: lastDayOfMonth,
      },
    });
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
  console.log("COUNT")
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
                attributes: ["id", "code", "name"]
            }
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
        attributes: ["id", "code", "name"]
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
          attributes: ["id"]
        },
        {
          model: WasteTypes,
          as: 'wastetype',
          attributes: ["id", "code", "name"]
        },
      ],
    });
  }

  async getByFilter(filterOptions) {
    console.log("PAGE")
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
                attributes: ["id", "code", "name"]
            }
        ],
        order: [['collection_date', 'ASC']] // Adjust the sorting as per your requirements
    });
}
  async collectionPerWeekByStudentId(id) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);

    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust start of the week based on Sunday
    startOfWeek.setDate(diff);

    const daysToAdd = 5 - dayOfWeek + (dayOfWeek === 0 ? 7 : 0); // Adjust end of the week based on Friday
    endOfWeek.setDate(today.getDate() + daysToAdd);

    try {
      const wasteTypes = await WasteTypes.findAll({ raw: true });
      const weekdays = await WeekDay.findAll({ raw: true });

      const result = [];

      for (const wasteType of wasteTypes) {
        const wasteTypeData = {
          waste_type: wasteType.name,
          weekday: {},
        };

        for (const weekday of weekdays) {
          const collection = await WasteCollection.findOne({
            where: {
              student_class_id: id,
              collection_date: {
                [Op.between]: [startOfWeek, endOfWeek],
              },
              waste_type_id: wasteType.id,
              day_id: weekday.id,
            },
            attributes: [
              [sequelize.fn("SUM", sequelize.col("weight")), "totalWeight"], // Calculate total weight
            ],
            raw: true,
          });

          wasteTypeData.weekday[weekday.name.toLowerCase()] = collection
            ? collection.totalWeight || 0
            : 0;
        }

        result.push(wasteTypeData);
      }

      return result;
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
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);

    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust start of the week based on Sunday
    startOfWeek.setDate(diff);

    const daysToAdd = 5 - dayOfWeek + (dayOfWeek === 0 ? 7 : 0); // Adjust end of the week based on Friday
    endOfWeek.setDate(today.getDate() + daysToAdd);

    return WeekDay.findAll({
      attributes: [
        [sequelize.literal("weekday.name"), "name"],
        [
          sequelize.fn("SUM", sequelize.literal("wastecollections.weight")),
          "weight",
        ],
      ],
      include: [
        {
          model: WasteCollection,
          attributes: [],
          required: false,
          include: [
            {
              model: StudentClass,
              attributes: [],
              required: true,
            },
          ],
          where: {
            "$wastecollections.studentclass.student_id$": id,
            "$wastecollections.studentclass.is_active$": "Ya",
            collection_date: {
              [Op.between]: [startOfWeek, endOfWeek],
            },
          },
        },
      ],
      order: [["id", "ASC"]],
      group: ["name"],
    });
  }

  async targetAchievement(id, is_current) {
    const currentDate = new Date();
    let currentMonthStart = new Date();
    let currentMonthEnd = new Date();

    if (is_current === "1") {
      console.log(is_current);
      currentMonthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      currentMonthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
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
}
module.exports = WasteCollectionDao;
