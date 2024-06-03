const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const FinancialPost = models.financialpost;

class FinancialPostDao extends SuperDao {
  constructor() {
    super(FinancialPost);
  }

  async getCount(search) {
    return FinancialPost.count({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            in_out: {
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

  async getFinancialPostPage(search, offset, limit) {
    return FinancialPost.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            in_out: {
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
module.exports = FinancialPostDao;
