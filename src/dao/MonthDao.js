const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Month = models.months;

class MonthDao extends SuperDao {
  constructor() {
    super(Month);
  }

  async getCount(search) {
    return Month.count({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            status: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getMonthPage(search, offset, limit) {
    return Month.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            status: {
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
module.exports = MonthDao;