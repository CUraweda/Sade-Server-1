const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, fn, col } = require("sequelize");

const WasteOfficer = models.wasteofficer;
const Student = models.students;
const Class = models.classes;

class WasteOfficerDao extends SuperDao {
  constructor() {
    super(WasteOfficer);
  }

  async getCountByDate(date) {
    return WasteOfficer.count({
      where: {
        assignment_date: {
          [Op.like]: `%${date}%`
        }
      }
    })
  }

  async findByAssignmentDate(date, page, limit, search, offset) {
    try {
      return WasteOfficer.findAll({
        where: {
          assignment_date: {
            [Op.like]: `%${date}%`
          }
        },
        attributes: ['id', 'name', 'assignment_date'],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ["id", "nis", "full_name"]
          },
          {
            model: Class,
            as: 'class',
            attributes: ["id", "level", "class_name"]
          }
        ],
        offset: offset,
        limit: limit,
        order: [["id", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error in findByAssignmentDate DAO: ${error.message}`);
    }
  }

  async getCount(filter) {
    const { search, date } = filter
    return WasteOfficer.count({
      where: {
        [Op.or]: [
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class_name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            assignment_date: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
        ...(date && { created_at: { [Op.between]: [date.start_date, date.end_date] } }),
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ["id", "nis", "full_name"]
        },
        {
          model: Class,
          as: 'class',
          attributes: ["id", "level", "class_name"]
        }
      ]
    });
  }

  async getWasteOfficerPage(filter, offset, limit) {
    const { search, date } = filter
    return WasteOfficer.findAll({
      where: {
        [Op.or]: [
          {
            "$class.class_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class_name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            assignment_date: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
        ...(date && { assignment_date: { [Op.between]: [date.start_date, date.end_date] } }),
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ["id", "nis", "full_name"]
        },
        {
          model: Class,
          as: 'class',
          attributes: ["id", "level", "class_name"]
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = WasteOfficerDao;
