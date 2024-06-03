"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClassTimetable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClassTimetable.belongsTo(models.classes, { foreignKey: "class_id" });
      ClassTimetable.belongsTo(models.weekday, { foreignKey: "day_id" });
      ClassTimetable.belongsTo(models.subjects, { foreignKey: "subject_id" });
    }
  }
  ClassTimetable.init(
    {
      class_id: DataTypes.INTEGER,
      day_id: DataTypes.INTEGER,
      subject_id: DataTypes.INTEGER,
      semester: DataTypes.INTEGER,
      time_seq: DataTypes.INTEGER,
      date_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "classtimetable",
      tableName: "tbl_class_timetable",
      underscored: true,
    }
  );
  return ClassTimetable;
};
