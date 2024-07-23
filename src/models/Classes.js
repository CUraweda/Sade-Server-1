"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Classes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Classes.hasMany(models.studentclass, {
        foreignKey: "class_id",
      });
      Classes.hasMany(models.formteacher, {
        foreignKey: "class_id",
      });
      Classes.hasMany(models.timetabletemp, {
        foreignKey: "class_id",
      });
      Classes.hasMany(models.classtimetable, {
        foreignKey: "class_id",
      });
      Classes.hasMany(models.timetable, {
        foreignKey: "class_id",
      });
      Classes.hasMany(models.reportsigners, {
        foreignKey: "class_id",
      });
      Classes.hasMany(models.task, { foreignKey: "class_id" });
      Classes.hasMany(models.narrativecategory, { foreignKey: "class_id" });
      Classes.hasMany(models.wasteofficer, { foreignKey: "class_id" });
      Classes.hasMany(models.overviews, { foreignKey: "class_id" })
      Classes.hasMany(models.announcements, { foreignKey: "class_id" });
    }
  }
  Classes.init(
    {
      level: DataTypes.STRING,
      class_name: DataTypes.STRING,
      book_target: DataTypes.INTEGER,
      waste_target: DataTypes.DOUBLE,
    },
    {
      sequelize,
      tableName: "ref_classes",
      modelName: "classes",
      underscored: true,
    }
  );
  return Classes;
};
