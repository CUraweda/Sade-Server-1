const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Task = models.task;
const Subjects = models.subjects;
const Classes = models.classes;
const TaskCategory = models.taskcategory;

class TaskDao extends SuperDao {
  constructor() {
    super(Task);
  }

  async getById(id) {
    return Task.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Subjects,
        },
        { model: Classes },
        { model: TaskCategory },
      ],
    });
  }

  async getTaskByClassId(classId, categoryId) {
    return Task.findAll({
      where: {
        class_id: classId,
        task_category_id: categoryId,
      },
      include: [
        {
          model: Subjects,
        },
        { model: Classes },
      ],
    });
  }

  async getCount(search) {
    return Task.count({
      where: {
        [Op.or]: [
          {
            "$subject.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$taskcategory.desc$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            topic: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            start_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            end_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            category: {
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
      include: [
        {
          model: Subjects,
        },
        { model: Classes },
        {
          model: TaskCategory,
        },
      ],
    });
  }

  async getTaskPage(search, offset, limit) {
    return Task.findAll({
      where: {
        [Op.or]: [
          {
            "$subject.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$taskcategory.desc$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            topic: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            start_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            end_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            category: {
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
      include: [
        {
          model: Subjects,
        },
        { model: Classes },
        {
          model: TaskCategory,
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = TaskDao;
