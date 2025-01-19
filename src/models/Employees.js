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
      Employees.hasOne(models.headmaster, {
        foreignKey: "employee_id",
      });
      Employees.hasMany(models.formextra, {
        foreignKey: "employee_id",
      });
      Employees.hasMany(models.employeesignature, {
        foreignKey: "employee_id",
      });
      Employees.hasMany(models.lessonplan, {
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
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      nik: DataTypes.STRING,
      religion: DataTypes.STRING,
      gender: DataTypes.STRING,
      pob: DataTypes.STRING,
      dob: DataTypes.DATE,
      marital_status: DataTypes.STRING,
      last_education: DataTypes.STRING,
      major: DataTypes.STRING,
      certificate_year: DataTypes.STRING,
      is_education: DataTypes.STRING,
      employee_status: DataTypes.STRING,
      work_start_date: DataTypes.STRING,
      occupation: DataTypes.STRING,
      is_teacher: DataTypes.STRING,
      duty: DataTypes.STRING,
      job_desc: DataTypes.STRING,
      grade: DataTypes.STRING,
      raw_grade: DataTypes.INTEGER,
      raw_finished_task: DataTypes.INTEGER,
      still_in_probation: DataTypes.BOOLEAN,
      probation_start_date: DataTypes.DATE,
      probation_end_date: DataTypes.DATE,
      division_id: DataTypes.INTEGER,
      is_outstation: DataTypes.BOOLEAN,
      active_outstation_id: DataTypes.INTEGER,
      is_asessor: DataTypes.BOOLEAN,
      raw_workhour: DataTypes.INTEGER,
      current_evaluation_id: DataTypes.INTEGER,
      needed_employee_files: DataTypes.STRING,
      is_on_contract: DataTypes.BOOLEAN,
      contract_end_date: DataTypes.DATE
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
