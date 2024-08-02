const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Task = models.task;
const Subjects = models.subjects;
const Classes = models.classes;
const TaskDetail = models.taskdetail
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

  async getTaskByClassId(classId, categoryId, student_id) {
    return Task.findAll({
      where: {
        class_id: classId,
        task_category_id: categoryId,
      },
      include: [
        {
          model: Subjects,
        },
        {
          model: TaskDetail,
          required: false,
          where: { student_id }
        },
        { model: Classes },
      ],
    });
  }

  async getCount(search, filters) {
    const { class_id, class_ids, academic } = filters

    const where = {
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
    }

    if (class_ids?.length) where["class_id"] = { [Op.in]: class_ids }
    if (academic) where[""]
    if (class_id) where["class_id"] = class_id

    return Task.count({
      where,
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

  async getTaskPage(search, offset, limit, filters) {
    const { class_id, class_ids } = filters

    const where = {
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
    }

    if (class_ids?.length) where["class_id"] = { [Op.in]: class_ids }

    if (class_id) where["class_id"] = class_id

    return Task.findAll({
      where,
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
