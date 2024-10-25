"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PinLocationAttendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PinLocationAttendance.init(
    {
      name: DataTypes.STRING,
      latitude: DataTypes.INTEGER,
      longitude: DataTypes.INTEGER,
      radius: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "tbl_pin_location",
      modelName: "pinlocation",
      timestamps: false,
      underscored: true,
    }
  );
  return PinLocationAttendance;
};
