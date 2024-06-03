const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const { startOfWeek, endOfWeek, addWeeks } = require("date-fns");

const EduCalendar = models.educalendar;
const EduCalendarDetails = models.educalendardetails;

class EduCalendarDao extends SuperDao {
  constructor() {
    super(EduCalendar);
  }

  //menampilkan kegiatan dua minggu ke depan
  async getByOngoingWeek(level, semester) {
    // Get the start and end dates of the current week
    const currentDate = new Date();
    const startDateOfWeek = startOfWeek(currentDate);
    // const endDateOfWeek = endOfWeek(currentDate);

    // const startDateOfNextWeek = startOfWeek(addWeeks(currentDate, 1));
    const endDateOfNextWeek = endOfWeek(addWeeks(currentDate, 1));

    return EduCalendarDetails.findAll({
      where: {
        start_date: {
          [Op.between]: [startDateOfWeek, endDateOfNextWeek],
        },
        "$educalendar.level$": level,
        "$educalendar.semester$": semester,
      },
      include: [
        {
          model: EduCalendar,
        },
      ],
      order: [["start_date", "DESC"]], // Order by start_date in descending order
      limit: 2, // Limit the result to 2 records
    });
  }

  async getCount(search) {
    return EduCalendar.count({
      where: {
        [Op.or]: [
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            semester: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getEduCalendarPage(search, offset, limit) {
    return EduCalendar.findAll({
      where: {
        [Op.or]: [
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            semester: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = EduCalendarDao;
