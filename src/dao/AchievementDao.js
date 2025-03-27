const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Achievement = models.achievements;
const Student = models.students
const StudentClass = models.studentclass

class AchievementDao extends SuperDao {
  constructor() {
    super(Achievement);
  }

  async getByStudentId(student_id, academic) {
    return Achievement.findAll({
      where: {
        student_id: student_id,
        ...(academic && { "$student.studentclass.academic_year$": academic })
      },
      order: [["id", "DESC"]],
    });
  }

  async getCount(search, filters) {
    const { class_id, class_ids, academic } = filters

    let classIds = []

    if (class_ids?.length) classIds = class_ids
    if (class_id) classIds = [class_id]

    return Achievement.count({
      where: {
        [Op.or]: [
          {
            achievement_desc: {
              [Op.like]: "%" + search + "%",
            },
          },
          // {
          //   "$student.full_name$": {
          //     [Op.like]: "%" + search + "%",
          //   },
          // },
        ],
        ...(academic && { "$student.studentclass.academic_year$": academic })
      },
      include: [
        {
          model: models.students,
          attributes: ["full_name"],
          required: classIds.length > 0,
          include: [
            {
              model: models.studentclass,
              include: [
                { model: models.classes }
              ],
              required: classIds.length > 0,
              ...(classIds.length && {
                where: {
                  class_id: {
                    [Op.in]: classIds
                  }
                },
              })
            }
          ]
        }
      ],
    });
  }

  async getTotalStudent(filter) {
    const { class_id } = filter
    return Achievement.findAll({
      ...(class_id && {
        include: [
          {
            model: Student,
            required: true,
            include: [
              {
                model: StudentClass,
                where: { class_id, is_active: "Y" },
                required: true
              }
            ]
          }
        ],
      }),
      group: ['student_id']
    })
  }

  async getAchievementPage(search, offset, limit, filters) {
    const { class_id, class_ids, academic } = filters

    let classIds = []

    if (class_ids?.length) classIds = class_ids

    if (class_id) classIds = [class_id]

    return Achievement.findAll({
      where: {
        [Op.or]: [
          {
            achievement_desc: {
              [Op.like]: "%" + search + "%",
            },
            "$student.full_name$": {
              [Op.like]: "%" + search + "%"
            }
          },
          // {
          //   "$student.full_name$": {
          //     [Op.like]: "%" + search + "%",
          //   },
          // },
        ],
        ...(academic && { "$student.studentclass.academic_year$": academic })
      },
      include: [
        {
          model: models.students,
          attributes: ["full_name"],
          required: classIds.length > 0,
          include: [
            {
              model: models.studentclass,
              inlcude: {
                model: models.classes
              },
              attributes: ["academic_year"],
              required: classIds.length > 0,
              ...(classIds.length && {
                where: {
                  class_id: {
                    [Op.in]: classIds
                  }
                },
              })
            }
          ]
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
  async getTopOne(student_id, academic) {
    return Achievement.findOne({
      where: {
        student_id: student_id,
        ...(academic && { "$student.studentclass.academic_year$": academic })
      },
      order: [["id", "DESC"]],
    });
  }
}
module.exports = AchievementDao;
