const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Religion = models.religion;

class ReligionDao extends SuperDao {
  constructor() {
    super(Religion);
  }

  async getCount(search) {
    return Religion.count({
      where: {
        [Op.or]: [
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

  async getReligionPage(search, offset, limit) {
    return Religion.findAll({
      where: {
        [Op.or]: [
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
module.exports = ReligionDao;
