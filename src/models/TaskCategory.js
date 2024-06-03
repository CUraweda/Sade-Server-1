"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaskCategory.hasMany(models.studenttask, {
        foreignKey: "task_category_id",
      });
      TaskCategory.hasMany(models.task, {
        foreignKey: "task_category_id",
      });
    }
  }
  TaskCategory.init(
    {
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "ref_task_categories",
      modelName: "taskcategory",
      timestamps: false,
      underscored: true,
    }
  );
  return TaskCategory;
};
