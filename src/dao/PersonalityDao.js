const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Personality = models.personality;

class PersonalityDao extends SuperDao {
  constructor() {
    super(Personality);
  }

  async getCount(search) {
    return Personality.count({
      where: {
        [Op.or]: [
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getPersonalityPage(search, offset, limit) {
    return Personality.findAll({
      where: {
        [Op.or]: [
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", "ASC"]],
    });
  }
}
module.exports = PersonalityDao;
