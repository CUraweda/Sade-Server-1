"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Roles.hasMany(models.user, { foreignKey: "role_id" });
    }
  }
  Roles.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      access_right: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "ref_roles",
      modelName: "roles",
      timestamps: false,
      underscored: true,
    }
  );
  return Roles;
};
