"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EduCalendarDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EduCalendarDetail.belongsTo(models.employees, {
        foreignKey: "teacher_id",
      });
      EduCalendarDetail.belongsTo(models.educalendar, {
        foreignKey: "edu_id",
      });
    }
  }
  EduCalendarDetail.init(
    {
      teacher_id: DataTypes.INTEGER,
      edu_id: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      agenda: DataTypes.STRING,
      color: DataTypes.STRING,
      only_teacher: DataTypes.BOOLEAN 
    },
    {
      sequelize,
      tableName: "tbl_edu_calendar_details",
      modelName: "educalendardetails",
      underscored: true,
    }
  );
  return EduCalendarDetail;
};
 