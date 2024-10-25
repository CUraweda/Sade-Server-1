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
  async getByOngoingWeek(level, semester, academic) {
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
        ...(academic && { "$educalendar.academic_year$": academic }),
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

  async getCount(search, filter) {
    const where = {
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
    }

    if (filter.academic) where['academic_year'] = filter.academic
    return EduCalendar.count({ where });
  }

  async getEduCalendarPage(search, offset, limit, filter) {
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
        ...(filter.academic && { academic_year: filter.academic })
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = EduCalendarDao;
