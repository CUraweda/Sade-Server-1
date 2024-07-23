"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FormSubject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FormSubject.belongsTo(models.subjects, {
        foreignKey: "subject_id",
      });
      FormSubject.belongsTo(models.employees, {
        foreignKey: "employee_id",
      });
    }
  }
  FormSubject.init(
    {
      subject_id: DataTypes.INTEGER,
      employee_id: DataTypes.INTEGER,
      academic_year: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "formsubject",
      tableName: "tbl_form_subject",
      underscored: true,
    }
  );
  return FormSubject;
};
