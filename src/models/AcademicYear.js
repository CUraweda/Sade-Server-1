"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AcademicYear extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AcademicYear.init(
    {
      start: DataTypes.STRING,
      end: DataTypes.STRING,
      name: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "ref_academic_years",
      modelName: "academicyear",
      timestamps: true,
      underscored: true,
    }
  );
  return AcademicYear;
};
