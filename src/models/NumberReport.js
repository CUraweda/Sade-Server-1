"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NumberReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NumberReport.belongsTo(models.subjects, {
        foreignKey: "subject_id",
      });

      NumberReport.belongsTo(models.studentreports, {
        foreignKey: "student_report_id",
      });
    }
  }
  NumberReport.init(
    {
      student_report_id: DataTypes.INTEGER,
      subject_id: DataTypes.INTEGER,
      grade: DataTypes.DOUBLE,
      grade_text: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "numberreport",
      tableName: "tbl_number_reports",
      underscored: true,
    }
  );
  return NumberReport;
};
