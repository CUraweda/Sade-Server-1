const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const NarrativeDesc = models.narrativedesc;

class NarrativeDescDao extends SuperDao {
  constructor() {
    super(NarrativeDesc);
  }

  async getBySubNarrativeId(id) {
    return NarrativeDesc.findAll({
      where: { narrative_sub_cat_id: id },
    });
  }

  async getCount(search) {
    return NarrativeDesc.count({
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

  async getNarrativeDescPage(search, offset, limit) {
    return NarrativeDesc.findAll({
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
      order: [["id", "DESC"]],
    });
  }
}
module.exports = NarrativeDescDao;
