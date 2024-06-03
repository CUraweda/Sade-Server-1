const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Timetable = models.timetable;
const Classes = models.classes;
const TimetableDetails = models.timetabledetail;

class TimetableDao extends SuperDao {
  constructor() {
    super(Timetable);
  }

  async findByClassId(classId, semester, academic) {
    return Timetable.findAll({
      where: {
        class_id: classId,
        semester: semester,
        academic_year: academic,
      },
      include: [
        {
          model: Classes,
          attributes: ["id", "level", "class_name"],
        },
      ],
    });

    // let timetable_details = [];

    // if (!timetable) {
    //   timetable_details = [];
    // } else {
    //   timetable_details = await TimetableDetails.findAll({
    //     where: {
    //       timetable_id: timetable.id,
    //     },
    //   });
    // }

    // const weeks = [];

    // timetable_details.forEach((detail) => {
    //   const date = new Date(detail.date_at);
    //   // Exclude weekends (Saturday and Sunday)
    //   if (date.getDay() !== 0 && date.getDay() !== 4) {
    //     const weekStartDate = new Date(
    //       date.getFullYear(),
    //       date.getMonth(),
    //       date.getDate() - date.getDay()
    //     );
    //     const weekEndDate = new Date(
    //       date.getFullYear(),
    //       date.getMonth(),
    //       date.getDate() - date.getDay() + 4
    //     );
    //     const week = `${weekStartDate.getDate()} - ${weekEndDate.getDate()} ${this.getMonthName(
    //       weekStartDate.getMonth()
    //     )} ${weekStartDate.getFullYear()}`;

    //     // Check if the week already exists
    //     const existingWeek = weeks.find((item) => item.week === week);
    //     if (existingWeek) {
    //       existingWeek.details.push(detail);
    //     } else {
    //       weeks.push({
    //         week: week,
    //         details: [detail],
    //       });
    //     }
    //   }
    // });

    // const result = {
    //   timetable: {
    //     ...timetable.toJSON(),
    //   },
    //   timetable_details: weeks,
    // };

    // return result;
  }
  getMonthName(monthIndex) {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return months[monthIndex];
  }

  // async findByClassId(classId, semester, academic) {
  //   let timetable = await Timetable.findOne({
  //     where: {
  //       class_id: classId,
  //       semester: semester,
  //       academic_year: academic,
  //     },
  //     include: [
  //       {
  //         model: Classes,
  //         attributes: ["id", "level", "class_name"],
  //       },
  //     ],
  //   });

  //   let timetable_details = [];

  //   if (!timetable) {
  //     timetable_details = [];
  //   } else {
  //     timetable_details = await TimetableDetails.findAll({
  //       where: {
  //         timetable_id: timetable.id,
  //       },
  //     });
  //   }
  //   const result = {
  //     timetable,
  //     timetable_details,
  //   };

  //   return result;
  // }

  async getCount(search) {
    return Timetable.count({
      where: {
        [Op.or]: [
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            semester: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            title: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            start_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            end_date: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Classes,
        },
      ],
    });
  }

  async getTimetablePage(search, offset, limit) {
    return Timetable.findAll({
      where: {
        [Op.or]: [
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            semester: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            title: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            start_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            end_date: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Classes,
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = TimetableDao;
