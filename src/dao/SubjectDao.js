const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Subject = models.subjects;
const FormSubject = models.formsubject
class SubjectDao extends SuperDao {
  constructor() {
    super(Subject);
  }

  async getAll(level) {
    return Subject.findAll({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: `%${level}%`
            }
          }
        ]
      },
      order: [["id", "asc"]]
    })
  }

  async getCount(search) {
    return Subject.count({
    where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getSubjectPage(filter, offset, limit) {
    const { search, employee } = filter
    return Subject.findAll({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      ...(employee && {
        include: [
          {
            model: FormSubject,
            where: { employee_id: employee.id },
            required: true
          }
        ]
      }),
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = SubjectDao;
