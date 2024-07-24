"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employees.belongsTo(models.user, { foreignKey: "user_id" })
      Employees.hasMany(models.formteacher, {
        foreignKey: "employee_id",
      });
      Employees.hasMany(models.formsubject, {
        foreignKey: "employee_id",
      });
      Employees.belongsTo(models.user, {
        foreignKey: "user_id",
      });
    }
  }
  Employees.init(
    {
      user_id: DataTypes.INTEGER,
      employee_no: DataTypes.STRING,
      full_name: DataTypes.STRING,
    gender: DataTypes.STRING,
      pob: DataTypes.STRING,
      dob: DataTypes.DATE,
      religion: DataTypes.STRING,
      marital_status: DataTypes.STRING,
      last_education: DataTypes.STRING,
      certificate_year: DataTypes.STRING,
      is_education: DataTypes.STRING,
      major: DataTypes.STRING,
      employee_status: DataTypes.STRING,
      work_start_date: DataTypes.STRING,
      occupation: DataTypes.STRING,
      is_teacher: DataTypes.STRING,
      duty: DataTypes.STRING,
      job_desc: DataTypes.STRING,
      grade: DataTypes.STRING,
      email: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "tbl_employees",
      modelName: "employees",
      underscored: true,
    }
  );
  return Employees;
};
