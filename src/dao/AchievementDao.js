const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Achievement = models.achievements;

class AchievementDao extends SuperDao {
  constructor() {
    super(Achievement);
  }

  async getByStudentId(student_id) {
    return Achievement.findAll({
      where: {
        student_id: student_id,
      },
      order: [["id", "DESC"]],
    });
  }

  async getCount(search) {
    return Achievement.count({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class_name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getAchievementPage(search, offset, limit) {
    return Achievement.findAll({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class_name: {
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
  async getTopOne(student_id) {
    return Achievement.findOne({
      where: {
        student_id: student_id,
      },
      order: [["id", "DESC"]],
    });
  }
}
module.exports = AchievementDao;
