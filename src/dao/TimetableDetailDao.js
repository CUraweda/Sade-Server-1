const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const TimetableDetail = models.timetabledetail;
const Timetable = models.timetable;
const WeekDay = models.weekday;

class TimetableDetailDao extends SuperDao {
  constructor() {
    super(TimetableDetail);
  }

  async getCount(search) {
    return TimetableDetail.count({
      where: {
        [Op.or]: [
          {
            "$timetable.title$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$weekday.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            date_at: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Timetable,
        },
        {
          model: WeekDay,
        },
      ],
    });
  }

  async getTimetableDetailPage(search, offset, limit) {
    return TimetableDetail.findAll({
      where: {
        [Op.or]: [
          {
            "$timetable.title$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$weekday.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            date_at: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Timetable,
        },
        {
          model: WeekDay,
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = TimetableDetailDao;
