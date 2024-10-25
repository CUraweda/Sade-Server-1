"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FormExtra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FormExtra.belongsTo(models.subjectextra, {
        foreignKey: "subject_extra_id",
      });
      FormExtra.belongsTo(models.employees, {
        foreignKey: "employee_id",
      });
    }
  }
  FormExtra.init(
    {
      subject_extra_id: DataTypes.INTEGER,
      employee_id: DataTypes.INTEGER,
      academic_year: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "formextra",
      tableName: "tbl_form_extra",
      underscored: true,
    }
  );
  return FormExtra;
};
