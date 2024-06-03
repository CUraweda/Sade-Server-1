const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const TaskCategory = models.taskcategory;

class TaskCategoryDao extends SuperDao {
  constructor() {
    super(TaskCategory);
  }

  async getCount(search) {
    return TaskCategory.count({
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

  async getTaskCategoryPage(search, offset, limit) {
    return TaskCategory.findAll({
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
module.exports = TaskCategoryDao;
