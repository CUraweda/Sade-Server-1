"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subjects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subjects.hasMany(models.studenttask, { foreignKey: "subject_id" });
      Subjects.hasMany(models.numberreport, { foreignKey: "subject_id" });
      Subjects.hasMany(models.timetabletemp, { foreignKey: "subject_id" });
      Subjects.hasMany(models.classtimetable, { foreignKey: "subject_id" });
      Subjects.hasMany(models.task, { foreignKey: "subject_id" });
      Subjects.hasMany(models.formsubject, { foreignKey: "subject_id" });
    }
  }
  Subjects.init(
    {
      level: DataTypes.STRING,
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      threshold: DataTypes.DOUBLE,
    },
    {
      sequelize,
      tableName: "ref_subjects",
      modelName: "subjects",
      timestamps: false,
      underscored: true,
    }
  );
  return Subjects;
};
