const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const User = models.user;

class UserDao extends SuperDao {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return User.findOne({ where: { email } });
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
}

module.exports = UserDao;
