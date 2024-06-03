"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Templates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Templates.init(
    {
      code: DataTypes.STRING,
      desc: DataTypes.STRING,
      file_path: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "templates",
      tableName: "ref_templates",
      underscored: true,
    }
  );
  return Templates;
};
