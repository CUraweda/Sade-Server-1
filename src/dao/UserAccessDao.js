const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const UserAccess = models.useraccess;
const Students = models.students;
const Users = models.user;
const Parents = models.parents;
const Roles = models.roles;

class UserAccessDao extends SuperDao {
  constructor() {
    super(UserAccess);
  }

  async getById(id) {
    return UserAccess.findAll({
      where: { id },
      include: [
        {
          model: Students,
          include: [
            {
              model: Parents,
            },
          ],
        },
      ],
    });
  }

  async getCount(search) {
    return UserAccess.count({
      where: {
        [Op.or]: [
          {
            "$student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Students,
        },
        {
          model: Users,
        },
      ],
    });
  }

  async getUserAccessPage(search, offset, limit) {
    return UserAccess.findAll({
      where: {
        [Op.or]: [
          {
            "$student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      offset, limit,
      include: [
        {
          model: Students,
        },
        {
          model: Users,
          attributes: ["id", "uuid", "role_id", "full_name", "email"],
          include: [
            {
              model: Roles,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
  }

  async findByUserId(user_id) {
    return UserAccess.findAll({
      where: { user_id },
      include: [
        {
          model: Students,
          // attributes: ["id", "name"],
        },
        {
          model: Users,
          attributes: ["id", "uuid", "role_id", "full_name", "email", "status"],
          include: [
            {
              model: Roles,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
  }
}
module.exports = UserAccessDao;
