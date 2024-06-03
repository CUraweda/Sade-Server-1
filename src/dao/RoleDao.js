const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Roles = models.roles;

class RoleDao extends SuperDao {
  constructor() {
    super(Roles);
  }

  async getCount(search) {
    return Roles.count({
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

  async getRolePage(search, offset, limit) {
    return Roles.findAll({
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
module.exports = RoleDao;
