const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const WasteTypes = models.wastetypes;

class WasteTypesDao extends SuperDao {
  constructor() {
    super(WasteTypes);
  }

  async getCount(search) {
    return WasteTypes.count({
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

  async getWasteTypesPage(search, offset, limit) {
    return WasteTypes.findAll({
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
module.exports = WasteTypesDao;
