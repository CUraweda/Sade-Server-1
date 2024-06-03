const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ClassTimetable = models.classtimetable;
const Subjects = models.subjects;
const Weekday = models.weekday;
const Classes = models.classes;

class ClassTimetableDao extends SuperDao {
  constructor() {
    super(ClassTimetable);
  }

  async getById(id) {
    return ClassTimetable.findAll({
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

  async getByClassId(class_id) {
    return ClassTimetable.findAll({
      where: { class_id },
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

  async getCount(search) {
    return ClassTimetable.count({
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
          {
            date_at: {
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

  async getClassTimetablePage(search, offset, limit) {
    return ClassTimetable.findAll({
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
          {
            date_at: {
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
module.exports = ClassTimetableDao;
