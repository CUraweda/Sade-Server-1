const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const User = models.user;
const Employee = models.employees
const FormTeacher = models.formteacher
const Class = models.classes
const FormSubject = models.formsubject
const Subject = models.subjects
const FormXtra = models.formextra
const SubjectXtra = models.subjectextra
const Headmaster = models.headmaster

class UserDao extends SuperDao {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return User.findOne({ 
      where: { email },
      include: [
        { 
          model: Employee, 
          required: false, 
          attributes: ["id", "full_name"],
          include: [
            {
              model: Headmaster,
              attributes: ["id"],
              where: {
                is_active: true
              },
              required: false 
            },
            {
              model: FormTeacher,
              attributes: ["id", "class_id", "academic_year"],
              where: {
                is_active: true
              },
              required: false,
              include: [
                {
                  model: Class,
                  attributes: ["id", "level", "class_name"],
                  required: false
                }
              ]
            },
            {
              model: FormSubject,
              attributes: ["id", "subject_id", "academic_year"],
              where: {
                is_active: true
              },  
              required: false,
              include: [
                {
                  model: Subject,
                  attributes: ["id", "level", "name"],
                  required: false
                }
              ]
            },
            {
              model: FormXtra,
              attributes: ["id"],
              where: {
                is_active: true
              },  
              required: false,
              include: [
                {
                  model: SubjectXtra,
                  attributes: ["id", "name"],
                  required: false
                }
              ]
            }
          ]
        }
      ]
    });
  }

  async isEmailExists(email) {
    return User.count({ where: { email } }).then((count) => {
      if (count != 0) {
        return true;
      }
      return false;
    });
  }

  async createWithTransaction(user, transaction) {
    return User.create(user, { transaction });
  }

  async findByResetToken(resetToken) {
    return User.findOne({
      where: {
        reset_token: resetToken,
        reset_token_exp: { [Op.gt]: Date.now() },
      },
    });
  }

  async findUsersByRoles(roleIds) {
    if (!Array.isArray(roleIds)) {
      throw new Error("Role IDs must be provided as an array.");
    }
    return User.findAll({
      where: { role_id: { [Op.in]: roleIds }, status: 1, email_verified: 1 },
      attributes: ["id", "uuid", "role_id", "full_name", "email"],
    });
  }

  async findUserByUUID(uuid) {
    return User.findOne({
      where: { uuid },
      include: [
        { 
          model: Employee, 
          required: false, 
          attributes: ["id", "full_name"],
          include: [
            {
              model: Headmaster,
              attributes: ["id"],
              where: {
                is_active: true
              },
              required: false 
            },
            {
              model: FormTeacher,
              attributes: ["id", "class_id", "academic_year"],
              where: {
                is_active: true
              },
              required: false,
              include: [
                {
                  model: Class,
                  attributes: ["id", "level", "class_name"],
                  required: false
                }
              ]
            },
            {
              model: FormSubject,
              attributes: ["id", "subject_id", "academic_year"],
              where: {
                is_active: true
              },  
              required: false,
              include: [
                {
                  model: Subject,
                  attributes: ["id", "level", "name"],
                  required: false
                }
              ]
            },
            {
              model: FormXtra,
              attributes: ["id"],
              where: {
                is_active: true
              },  
              required: false,
              include: [
                {
                  model: SubjectXtra,
                  attributes: ["id", "name"],
                  required: false
                }
              ]
            }
          ]
        }
      ]
    });
  }
  
  async getCount(search) {
    return User.count({
      where: {
        [Op.or]: [
          {
            full_name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }
  
  async getUserPage(search, offset, limit) {
    return User.findAll({
      where: {
        [Op.or]: [
          {
            full_name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
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
}

module.exports = UserDao;
