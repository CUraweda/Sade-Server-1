const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Subject = models.subjects;

class SubjectDao extends SuperDao {
  constructor() {
    super(Subject);
  }

  async getCount(search) {
    return Subject.count({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getSubjectPage(search, offset, limit) {
    return Subject.findAll({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
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
}
module.exports = SubjectDao;
