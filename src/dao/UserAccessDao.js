const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const UserAccess = models.useraccess;
const Students = models.students;
const Users = models.user;
const StudentClass = models.studentclass
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
          required: true,
          attributes: {
            exclude: ["student_id"]
          },
          include: [
            {
              model: Parents,
            },
          ],
        },
      ],
    });
  }

  async getCount(search, filter) {
    const { ortu_only, level, class_name } = filter
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
        ...(ortu_only === "1" && { "$user.role_id$": 8 }),
        ...(level && { "$student.level$": { [Op.like]: `%${level}%` } }),
        ...(class_name && { "$student.class$": { [Op.like]: `%${class_name}%` } })
      },
      include: [
        {
          model: Students,
          attributes: {
            exclude: ["student_id"]
          },    
          required: true,
        },
        {
          model: Users,
          required: true
        },
      ],
    });
  }
  
  async getUserAccessPage(search, offset, limit, filter) {
    const { ortu_only, level, class_name } = filter
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
        ...(ortu_only === "1" && { "$user.role_id$": 8 }),
        ...(level && { "$student.level$": { [Op.like]: `%${level}%` } }),
        ...(class_name && { "$student.class$": { [Op.like]: `%${class_name}%` } })

      },
      offset, limit,
      include: [
        {
          model: Students,
          required: true,
          attributes: {
            exclude: ["student_id"]
          },
        },
        {
          model: Users,
          required: true,
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
          attributes: {
            exclude: ["student_id"]
          }
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
