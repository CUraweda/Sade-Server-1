"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserAccess.belongsTo(models.students, {
        foreignKey: "student_id",
      });
      UserAccess.belongsTo(models.user, {
        foreignKey: "user_id",
      });
    }
  }
  UserAccess.init(
    {
      user_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "useraccess",
      tableName: "tbl_user_access",
      underscored: true,
    }
  );
  return UserAccess;
};
