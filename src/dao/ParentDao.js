const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Parents = models.parents;
const Students = models.students;

class ParentDao extends SuperDao {
  constructor() {
    super(Parents);
  }

  async getCount(search) {
    return Parents.count({
      where: {
        [Op.or]: [
          {
            parent_type: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nationality: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            religion: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            marriage_to: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            in_age: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            relationship_to_student: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            address: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            phone: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            com_priority: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            last_education: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            salary: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            field_of_work: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getParentsPage(search, offset, limit) {
    return Parents.findAll({
      where: {
        [Op.or]: [
          {
            parent_type: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nationality: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            religion: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            marriage_to: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            in_age: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            relationship_to_student: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            address: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            phone: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            com_priority: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            last_education: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            salary: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            field_of_work: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }

  async findByStudentId(student_id) {
    return Parents.findAll({
      where: { student_id },
      include: [
        {
          model: Students,
          // attributes: ["id", "name"],
        },
      ],
    });
  }
}
module.exports = ParentDao;
