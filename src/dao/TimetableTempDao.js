const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const TimetableTemp = models.timetabletemp;
const Subjects = models.subjects;
const Weekday = models.weekday;
const Classes = models.classes;

class TimetableTempDao extends SuperDao {
  constructor() {
    super(TimetableTemp);
  }

  async getById(id) {
    return TimetableTemp.findAll({
      where: { id },
      include: [
        {
          model: Classes,
          attributes: ["id", "level", "class_name"],
        },
        {
          model: Weekday,
        },
        {
          model: Subjects,
        },
      ],
    });
  }

  async getByDayId(day_id) {
    return TimetableTemp.findAll({
      where: { day_id },
      include: [
        {
          model: Classes,
          attributes: [],
        },
        {
          model: Weekday,
          attributes: [],
        },
        {
          model: Subjects,
          attributes: [],
        },
      ],
    });
  }

  async getCount(search) {
    return TimetableTemp.count({
      where: {
        [Op.or]: [
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$weekday.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$subject.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            semester: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            time_seq: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Classes,
          attributes: ["id", "level", "class_name"],
        },
        {
          model: Weekday,
        },
        {
          model: Subjects,
        },
      ],
    });
  }

  async getTimetableTempPage(search, offset, limit) {
    return TimetableTemp.findAll({
      where: {
        [Op.or]: [
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$weekday.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$subject.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            semester: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            time_seq: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Classes,
          attributes: ["id", "level", "class_name"],
        },
        {
          model: Weekday,
        },
        {
          model: Subjects,
        },
      ],
    });
  }
}
module.exports = TimetableTempDao;
