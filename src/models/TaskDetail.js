"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaskDetail.belongsTo(models.task, { foreignKey: "task_id" });
      TaskDetail.belongsTo(models.students, { foreignKey: "student_id" });
    }
  }
  TaskDetail.init(
    {
      task_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
      work_date: DataTypes.DATE,
      task_file: DataTypes.STRING,
      feedback: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "taskdetail",
      tableName: "tbl_task_details",
      underscored: true,
    }
  );
  return TaskDetail;
};
