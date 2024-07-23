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

  async getCount(search, academic_year, is_active) {
    const conditions = {
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
            }
        ]
    };

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

    return FormSubject.count({
        where: conditions,
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


  async getFormSubjectPage(search, offset, limit, academic_year, is_active) {
    const conditions = {
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
            }
        ]
    };

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

    return FormSubject.findAll({
        where: conditions,
        include: [
            {
                model: Employees,
            },
            {
                model: Subject,
            },
        ],
        offset: offset,
        limit: limit,
        order: [["id", "DESC"]],
    });
  }

}
module.exports = FormSubjectDao;
