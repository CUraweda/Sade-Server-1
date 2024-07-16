"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Students.hasMany(models.studentclass, { foreignKey: "student_id" });
      Students.hasMany(models.useraccess, { foreignKey: "student_id" });
      Students.hasMany(models.parents, { foreignKey: "student_id" });
      Students.hasMany(models.borrowbook, { foreignKey: "student_id" });
      Students.hasMany(models.bookreview, { foreignKey: "student_id" });
      Students.hasMany(models.achievements, { foreignKey: "student_id" });
      Students.hasMany(models.taskdetail, { foreignKey: "student_id" });
      Students.hasMany(models.studentdata, { foreignKey: "student_id" });
      Students.hasMany(models.wasteofficer, { foreignKey: "student_id" });
    }
  }
  Students.init(
    {
      nis: DataTypes.STRING,
      nisn: DataTypes.STRING,
      full_name: DataTypes.STRING,
      nickname: DataTypes.STRING,
      gender: DataTypes.STRING,
      pob: DataTypes.STRING,
      dob: DataTypes.DATE,
      nationality: DataTypes.STRING,
      religion: DataTypes.STRING,
      address: DataTypes.STRING,
      level: DataTypes.STRING,
      class: DataTypes.STRING,
      is_active: DataTypes.STRING,
      is_transfer: DataTypes.STRING,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "tbl_students",
      modelName: "students",
      underscored: true,
    }
  );
  return Students;
};
