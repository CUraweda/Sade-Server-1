"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.subjects, { foreignKey: "subject_id" });
      Task.belongsTo(models.classes, { foreignKey: "class_id" });
      Task.hasMany(models.taskdetail, { foreignKey: "task_id" });
      Task.belongsTo(models.taskcategory, { foreignKey: "task_category_id" });
    }
  }
  Task.init(
    {
      class_id: DataTypes.INTEGER,
      subject_id: DataTypes.INTEGER,
      task_category_id: DataTypes.INTEGER,
      topic: DataTypes.STRING,
      description: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      category: DataTypes.STRING,
      status: DataTypes.STRING,
      task_file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "task",
      tableName: "tbl_tasks",
      underscored: true,
    }
  );
  return Task;
};
