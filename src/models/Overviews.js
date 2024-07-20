"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Overviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Overviews.belongsTo(models.classes, {
        foreignKey: "class_id"
      })
    }
  }
  Overviews.init(
    {
      topic: DataTypes.STRING,
      meaningful_understanding: DataTypes.STRING,
      period: DataTypes.STRING,
      tup: DataTypes.TEXT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "tbl_overviews",
      modelName: "overviews",
      underscored: true,
    }
  );
  return Overviews;
};
