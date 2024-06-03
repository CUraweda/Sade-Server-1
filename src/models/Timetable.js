"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timetable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Timetable.belongsTo(models.classes, {
        foreignKey: "class_id",
      });

      Timetable.hasMany(models.timetabledetail, {
        foreignKey: "timetable_id",
      });
    }
  }
  Timetable.init(
    {
      academic_year: DataTypes.STRING,
      class_id: DataTypes.INTEGER,
      semester: DataTypes.INTEGER,
      title: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      hide_student: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "timetable",
      tableName: "tbl_timetable",
      underscored: true,
    }
  );
  return Timetable;
};
