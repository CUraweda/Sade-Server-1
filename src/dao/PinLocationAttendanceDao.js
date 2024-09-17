const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const PinLocation = models.pinlocation;

class PinLocationDao extends SuperDao {
  constructor() {
    super(PinLocation);
  }

  async getCount(search) {
    return PinLocation.count({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
            latitude: {
                [Op.like]: "%" + search + "%",
            },
            longitude: {
              [Op.like]: "%" + search + "%",
            },
            radius: {
                [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getPinLocationPage(search, offset, limit) {
    return PinLocation.findAll({
      where: {
        [Op.or]: [
          {
            name: {
                [Op.like]: "%" + search + "%",
            },
            latitude: {
                [Op.like]: "%" + search + "%",
            },
            longitude: {
            [Op.like]: "%" + search + "%",
            },
            radius: {
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
module.exports = PinLocationDao;
