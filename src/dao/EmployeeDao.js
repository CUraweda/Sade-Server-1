const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Employees = models.employees;
const User = models.user

class EmployeesDao extends SuperDao {
  constructor() {
    super(Employees);
  }

  async getEmployeeByIsTeacher(isTeacher) {
    return Employees.findAll({
      where: {
        is_teacher: isTeacher,
      },
    });
  }

  async getCount(search) {
    return Employees.count({
      where: {
        [Op.or]: [
          {
            employee_no: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            full_name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            gender: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            pob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            dob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            religion: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            marital_status: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            last_education: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            certificate_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            is_education: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            major: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            employee_status: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            work_start_date: {
              [Op.like]: "%" + search + "%",
            },
        },
          {
            occupation: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            duty: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            job_desc: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getByUserId(user_id) {
    return Employees.findAll({
      where: { user_id }
    })
  }

  async getEmployeesPage(filter, offset, limit) {
    const { isGuru, search, isAssign } = filter
    return Employees.findAll({
      where: {
        ...(isGuru && { is_teacher: isGuru }),
        ...(isAssign && {
          user_id: {
            ...(isAssign != "N" ? {
              [Op.not]: null
            } : {
              [Op.is]: null
            })
          }
        }),
        [Op.or]: [
          {
            employee_no: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            full_name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            gender: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            pob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            dob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            religion: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            marital_status: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            last_education: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            certificate_year: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            is_education: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            major: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            employee_status: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            work_start_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            occupation: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            duty: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            job_desc: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: User,
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = EmployeesDao;
