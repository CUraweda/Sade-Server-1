"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeSignature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmployeeSignature.belongsTo(models.employees, { foreignKey: 'employee_id' })
      EmployeeSignature.belongsTo(models.classes, { foreignKey: 'form_teacher_class_id' })
    }
  }
  EmployeeSignature.init(
    {
        employee_id: DataTypes.INTEGER,
        signature_path: DataTypes.STRING,
        signature_name: DataTypes.STRING,
        is_headmaster: DataTypes.BOOLEAN,
        headmaster_of: DataTypes.STRING,
        is_form_teacher: DataTypes.BOOLEAN, 
        form_teacher_class_id: DataTypes.INTEGER
    },
    {
      sequelize,
      tableName: "tbl_employee_signature",
      modelName: "employeesignature",
      underscored: true,
      timestamps: false
    }
  );
  return EmployeeSignature;
};
