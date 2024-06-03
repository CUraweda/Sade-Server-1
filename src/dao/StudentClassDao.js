const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const StudentClass = models.studentclass;
const Students = models.students;
const Classes = models.classes;

class StudentClassDao extends SuperDao {
  constructor() {
    super(StudentClass);
  }

  async getById(id) {
    return StudentClass.findAll({
      where: { id },
      include: [
        {
          model: Students,
        },
      ],
    });
  }
  async getByClasses(class_id, academic_year) {
    return StudentClass.findAll({
      where: {
        class_id: class_id,
        academic_year: academic_year,
        is_active: "Ya",
      },
      include: [
        {
          model: Students,
        },
      ],
      order: [["id", "ASC"]],
    });
  }

  async getCount(search) {
    return StudentClass.count({
      where: {
        [Op.or]: [
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            is_active: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Students,
        },
        {
          model: Classes,
        },
      ],
    });
  }

  async getStudentClassPage(search, offset, limit) {
    return StudentClass.findAll({
      where: {
        [Op.or]: [
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            academic_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            is_active: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Students,
        },
        {
          model: Classes,
        },
      ],
    });
  }
}
module.exports = StudentClassDao;
