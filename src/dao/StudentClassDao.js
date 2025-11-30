const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, literal } = require("sequelize");
const { required } = require("joi");

const StudentClass = models.studentclass;
const Students = models.students;
const User = models.user
const Classes = models.classes;
const UserAccess = models.useraccess
const Reports = models.studentreports;
const StudentAttendance = models.studentattendance

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

  getByStudentId(student_id) {
    return StudentClass.findAll({
      where: { student_id },
      include: [
        {
          model: Students
        },
        {
          model: Classes
        }
      ]
    })
  }
  async getByClasses(class_id, filter) {
    const { date } = filter
    const where = {
      class_id,
      is_active: "Ya",
    };
    const include = [{ model: Students }]
    if(date) {
      include.push({
        model: StudentAttendance,
        where: {
          [Op.and]: [
            { att_date: { [Op.gte]: `${date}T00:00:00.000Z` } },
            { att_date: { [Op.lte]: `${date}T23:59:59.999Z` } },
          ]
        },
        required: false,
      })
    }

    return StudentClass.findAll({
      where, include,
      ...(date && {
        group: ['id'],
        having: literal('COUNT(studentattendances.id) = 0')
      }),
      order: [
        [{ model: Students, as: 'student' }, 'full_name', 'ASC'],
      ],
    });
  }


  async getAllStudentFromClasses(class_id = [], search) {
    if (!Array.isArray(class_id)) throw new Error('Role IDs must be provided as an array')
    return StudentClass.findAll({
      where: {
        class_id: { [Op.in]: class_id },
        is_active: "Ya"
      },
      include: [
        {
          model: Students,
          required: true,
          include: {
            model: UserAccess, required: true, include: {
              model: User, where: {
                ...(search && {
                  full_name: { [Op.like]: `%${search}%` }
                })
              }
            }
          }
        }
      ]
    })
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

  async getCount(search, classId, academic, class_id) {
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
