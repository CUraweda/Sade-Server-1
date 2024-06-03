"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentTask.belongsTo(models.subjects, { foreignKey: "subject_id" });
      StudentTask.belongsTo(models.studentclass, {
        foreignKey: "student_class_id",
      });
      StudentTask.belongsTo(models.taskcategory, {
        foreignKey: "task_category_id",
      });
    }
  }
  StudentTask.init(
    {
      student_class_id: DataTypes.INTEGER,
      task_category_id: DataTypes.INTEGER,
      semester: DataTypes.INTEGER,
      subject_id: DataTypes.INTEGER,
      topic: DataTypes.STRING,
      characteristic: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      status: DataTypes.STRING,
      assign_value: DataTypes.DOUBLE,
      feed_fwd: DataTypes.STRING,
      up_file: DataTypes.STRING,
      down_file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "studenttask",
      tableName: "tbl_student_task",
      underscored: true,
    }
  );
  return StudentTask;
};
