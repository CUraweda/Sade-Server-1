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

  async getCount(filter) {
    const { search, academic, active } = filter
    return FormTeacher.count({
      where: {
        ...(academic && { academic_year: academic }),
        ...(active && { status: active != "N" ? "active" : "non-active" }),
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

  async getFormTeacherPage(filter, offset, limit) {
    const { search, academic, active } = filter
    return FormTeacher.findAll({
      where: {
        ...(academic && { academic_year: academic }),
        ...(active && { status: active != "N" ? "active" : "non-active" }),
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
