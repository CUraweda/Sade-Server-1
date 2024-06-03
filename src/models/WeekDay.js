"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WeekDay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WeekDay.hasMany(models.wastecollection, {
        foreignKey: "day_id",
      });
      WeekDay.hasMany(models.timetabletemp, {
        foreignKey: "day_id",
      });
      WeekDay.hasMany(models.classtimetable, {
        foreignKey: "day_id",
      });
      WeekDay.hasMany(models.timetabledetail, {
        foreignKey: "day_id",
      });
    }
  }
  WeekDay.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "weekday",
      tableName: "ref_weekday",
      timestamps: false,
      underscored: true,
    }
  );
  return WeekDay;
};
