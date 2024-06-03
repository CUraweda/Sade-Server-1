"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EduCalendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EduCalendar.hasMany(models.educalendardetails, {
        foreignKey: "edu_id",
      });
    }
  }
  EduCalendar.init(
    {
      academic_year: DataTypes.STRING,
      level: DataTypes.STRING,
      semester: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "tbl_edu_calendars",
      modelName: "educalendar",
      underscored: true,
    }
  );
  return EduCalendar;
};
