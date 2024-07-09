const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const StudentClass = models.studentclass;
const Students = models.students;
const Classes = models.classes;
const Reports = models.studentreports;

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

  async getByLevel(level, academic_year) {
    return StudentClass.findAll({
      where: {
        "$class.level$": level,
        academic_year: academic_year,
        is_active: "Ya",
      },
      include: [
        {
          model: Students,
        },
        {
          model: Classes
        }
      ],
      order: [["id", "ASC"]],
    });
  }

  async getCount(search, classId, academic) {
    const where = {
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
    }

    if (classId) where['class_id'] = parseInt(classId);
		if (academic) where['academic_year'] = academic;

    return StudentClass.count({
      where,
      include: [
        {
          model: Students,
        },
        {
          model: Classes,
        },
        {
          model: Reports,
          attributes: ['id', 'student_access', 'semester'],
          separate: true,
        }
      ],
    });
  }

  async getStudentClassPage(search, offset, limit, classId, academic) {
    const where = {
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
    }

    if (classId) where['class_id'] = parseInt(classId)
    if (academic) where['academic_year'] = academic;
    
    return StudentClass.findAll({
      where,
      offset: offset,
      limit: limit,
      include: [
        {
          model: Students,
        },
        {
          model: Classes,
        },
        {
          model: Reports,
          attributes: ['id', 'student_access', 'semester'],
          separate: true,
        }
      ],
    });
  }
}
module.exports = StudentClassDao;
