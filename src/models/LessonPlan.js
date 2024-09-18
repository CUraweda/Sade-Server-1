'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LessonPlan.init({
    assignments_name: DataTypes.STRING,
    subjects_name: DataTypes.STRING,
    class: DataTypes.STRING,
    file_path: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: "lessonplan",
    tableName: "tbl_lesson_plan",
    underscored: true,
  });
  return LessonPlan;
};
