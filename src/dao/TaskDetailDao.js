const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const TaskDetail = models.taskdetail;
const Task = models.task;
const Students = models.students;

class TaskDetailDao extends SuperDao {
  constructor() {
    super(TaskDetail);
  }

  async getByTaskId(id) {
    return TaskDetail.findAll({
      where: {
        task_id: id,
      },
      include: [{ model: Task }, { model: Students }],
    });
  }

  async getCount(search) {
    return TaskDetail.count({
      where: {
        [Op.or]: [
          {
            "$student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            work_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            feedback: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [{ model: Task }, { model: Students }],
    });
  }

  async getTaskDetailPage(search, offset, limit) {
    return TaskDetail.findAll({
      where: {
        [Op.or]: [
          {
            "$student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            work_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            feedback: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [{ model: Task }, { model: Students }],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = TaskDetailDao;
