const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const FormSubject = models.formsubject;
const Employees = models.employees;
const Subject = models.subjects;

class FormSubjectDao extends SuperDao {
  constructor() {
    super(FormSubject);
  }

  async getById(id) {
    return FormSubject.findAll({
      where: { id },
      include: [
        {
          model: Subject,
        },
        {
          model: Employees,
        },
      ],
    });
  }

  async getCount(search) {
    return FormSubject.count({
      where: {
        [Op.or]: [
          {
            "$subject.name$": {
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
          model: Subject,
        },
      ],
    });
  }

  async getFormSubjectPage(search, offset, limit) {
    return FormSubject.findAll({
      where: {
        [Op.or]: [
          {
            "$subject.name$": {
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
          model: Subject,
        },
      ],
    });
  }
}
module.exports = FormSubjectDao;
