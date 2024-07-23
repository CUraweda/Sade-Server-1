"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentAttendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentAttendance.belongsTo(models.studentclass, {
        foreignKey: "student_class_id",
      });
    }
  }
  StudentAttendance.init(
    {
      student_class_id: DataTypes.STRING,
      att_date: DataTypes.DATE,
      att_time: DataTypes.TIME,
      semester: DataTypes.INTEGER,
      status: DataTypes.STRING,
      remark: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "studentattendance",
      tableName: "tbl_students_attendance",
      underscored: true,
    }
  );
  return StudentAttendance;
};
