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

  async getCount(search, academic_year, is_active) {
    const conditions = {
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
        }
      ]
    }
    
    if (academic_year) {
      conditions.academic_year = {
          [Op.like]: academic_year,
      };
    }

    if (is_active !== undefined) {
        conditions.is_active = {
            [Op.eq]: is_active,
        };
    }
    
    return FormTeacher.count({
      where: conditions,
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

  async getFormTeacherPage(search, offset, limit, academic_year, is_active) {
    const conditions = {
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
        }
      ]
    }
    
    if (academic_year) {
      conditions.academic_year = {
          [Op.like]: academic_year,
      };
    }

    if (is_active !== undefined) {
        conditions.is_active = {
            [Op.eq]: is_active,
        };
    }
    
    return FormTeacher.findAll({
      where: conditions,
      include: [
          {
              model: Employees,
          },
          {
              model: Classes,
          },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = FormTeacherDao;
