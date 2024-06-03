const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const FormTeacher = models.formteacher;
const Employees = models.employees;
const Classes = models.classes;

class FormTeacherDao extends SuperDao {
  constructor() {
    super(FormTeacher);
  }

  async getById(id) {
    return FormTeacher.findAll({
      where: { id },
      include: [
        {
          model: Classes,
        },
        {
          model: Employees,
        },
      ],
    });
  }

  async getCount(search) {
    return FormTeacher.count({
      where: {
        [Op.or]: [
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$employee.employee_no$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$employee.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            academic_year: {
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
          model: Employees,
        },
        {
          model: Classes,
        },
      ],
    });
  }

  async getFormTeacherPage(search, offset, limit) {
    return FormTeacher.findAll({
      where: {
        [Op.or]: [
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$employee.employee_no$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$employee.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            academic_year: {
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
          model: Employees,
        },
        {
          model: Classes,
        },
      ],
    });
  }
}
module.exports = FormTeacherDao;
