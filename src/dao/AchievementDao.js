const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Achievement = models.achievements;

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
