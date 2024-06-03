const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Classes = models.classes;

class ClassesDao extends SuperDao {
  constructor() {
    super(Classes);
  }

  async getCount(search) {
    return Classes.count({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class_name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getClassesPage(search, offset, limit) {
    return Classes.findAll({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class_name: {
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
module.exports = ClassesDao;
