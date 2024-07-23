const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Classes = models.classes;
const FormTeacher = models.formteacher
class ClassesDao extends SuperDao {
  constructor() {
    super(Classes);
  }

  async getCount(filter) {
    const { search, employee } = filter
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
      ...(employee && {
        include: [
          {
            model: FormTeacher,
            where: {
              employee_id: employee.id,
            },
            required: true,
          },
        ],
      }),
    });
  }

  async getClassesPage(filter, offset, limit) {
    const { search, employee } = filter
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
      ...(employee && {
        include: [
          {
            model: FormTeacher,
            where: {
              employee_id: employee.id,
            },
            required: true,
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
