const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const { level } = require("winston");

const Classes = models.classes;
const FormTeacher = models.formteacher
class ClassesDao extends SuperDao {
  constructor() {
    super(Classes);
  }

  async getCount(filter) {
    const { search, employee, levels } = filter
    return Classes.count({
      where: {
        ...((levels && levels.length > 0) && { level: levels }),
        [Op.or]: [
          {
            class_name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      ...(employee && {
        include: [
          {
            model: FormTeacher,
            where: {
              employee_id: employee.id
            },
            required: false,
          },
        ],
      }),
    });
  }

  async getClassesByLevels(levels = []) {
    return Classes.findAll({
      where: {
        [Op.in]: levels
      }
    })
  }

  async getClassesPage(filter, offset, limit) {
    const { search, employee, levels } = filter
    return Classes.findAll({
      where: {
        ...((levels && levels.length > 0) && { level: levels }),
        [Op.or]: [
          {
            class_name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      ...(employee && {
        include: [
          {
            model: FormTeacher,
            where: {
              employee_id: employee.id
            },
            required: false,
          },
        ],
      }),
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = ClassesDao;
