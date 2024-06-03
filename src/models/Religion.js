"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Religion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Religion.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "ref_religions",
      modelName: "religion",
      underscored: true,
    }
  );
  return Religion;
};
