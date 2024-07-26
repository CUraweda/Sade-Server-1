const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Headmaster = models.headmaster;
const Employees = models.employees;

class HeadmasterDao extends SuperDao {
  constructor() {
    super(Headmaster);
  }

  async getById(id) {
    return Headmaster.findAll({
      where: { id },
      include: [
        {
          model: Employees,
        },
      ],
    });
  }

  async getCount(search, start_academic_year, end_academic_year, is_active) {
    const conditions = {
      [Op.or]: [
            {
                "$employee.full_name$": {
                    [Op.like]: "%" + search + "%",
                },
            },
            {
                "$employee.employee_no$": {
                    [Op.like]: "%" + search + "%",
                },
            }
        ]
    }
    if (start_academic_year) {
        conditions.start_academic_year = {
            [Op.like]: start_academic_year,
        };
    }
    if (end_academic_year) {
        conditions.end_academic_year = {
            [Op.like]: end_academic_year,
        };
    }
    if (is_active !== undefined) {
        conditions.is_active = {
            [Op.eq]: is_active,
        };
    }

    return Headmaster.count({
        where: conditions,
        include: [
            {
                model: Employees
            },
        ],
    });
  }


  async getHeadmasterPage(search, offset, limit, start_academic_year, end_academic_year, is_active) {
    const conditions = {};
    if (search) {
        conditions[Op.or] = [
            {
                "$employee.full_name$": {
                    [Op.like]: "%" + search + "%",
                },
            },
            {
                "$employee.employee_no$": {
                    [Op.like]: "%" + search + "%",
                },
            },
        ];
    }
    if (start_academic_year) {
        conditions.start_academic_year = {
            [Op.like]: start_academic_year,
        };
    }
    if (end_academic_year) {
        conditions.end_academic_year = {
            [Op.like]: end_academic_year,
        };
    }
    if (is_active !== undefined) {
        conditions.is_active = {
            [Op.eq]: is_active,
        };
    }

    return Headmaster.findAll({
        where: conditions,
        include: [
            {
                model: Employees
            },
        ],
        offset: offset,
        limit: limit,
        order: [["id", "DESC"]],
    });
  }

}
module.exports = HeadmasterDao;
