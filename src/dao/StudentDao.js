const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, where } = require("sequelize");

const Students = models.students;
const StudentClass = models.studentclass;
const Classes = models.classes;

class StudentDao extends SuperDao {
  constructor() {
    super(Students);
  }

  async getCount(search) {
    return Students.count({
      where: {
        [Op.or]: [
          {
            nis: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nisn: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            full_name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nickname: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            gender: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            pob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            dob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nationality: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            religion: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getStudentPage(search, offset, limit) {
    return Students.findAll({
      where: {
        [Op.or]: [
          {
            nis: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nisn: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            full_name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nickname: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            gender: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            pob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            dob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nationality: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            religion: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class: {
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

  async findByNis(nis, dob) {
    return Students.findOne({
      where: {
        nis,
        ...(dob && { dob: { [Op.like]: `%${dob}%` } })
      }
    });
  }

  async getById(id) {
    return Students.findAll({
      where: { id },
      include: [
        {
          model: StudentClass,
          where: {
            is_active: "Ya",
          },
          include: [
            {
              model: Classes,
            },
          ],
        },
      ],
    });
  }

  async updateClass(student_id, class_id) {
    const classData = await Classes.findOne({ id: class_id })
    return Students.update({
      class: classData.class_name,
      level: classData.level
    }, { where: { id: student_id } })
  }
}
module.exports = StudentDao;
