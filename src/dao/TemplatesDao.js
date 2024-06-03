const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Templates = models.templates;

class TemplatesDao extends SuperDao {
  constructor() {
    super(Templates);
  }

  async getByCode(code) {
    return Templates.findOne({
      where: {
        code: code,
      },
    });
  }

  async getCount(search) {
    return Templates.count({
      where: {
        [Op.or]: [
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getTemplatesPage(search, offset, limit) {
    return Templates.findAll({
      where: {
        [Op.or]: [
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            desc: {
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
module.exports = TemplatesDao;
