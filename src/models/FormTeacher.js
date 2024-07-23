"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FormTeacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FormTeacher.belongsTo(models.classes, {
        foreignKey: "class_id",
      });
      FormTeacher.belongsTo(models.employees, {
        foreignKey: "employee_id",
      });
    }
  }
  FormTeacher.init(
    {
      class_id: DataTypes.INTEGER,
      employee_id: DataTypes.INTEGER,
      academic_year: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "formteacher",
      tableName: "tbl_form_teacher",
      underscored: true,
    }
  );
  return FormTeacher;
};
