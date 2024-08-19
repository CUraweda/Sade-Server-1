"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentReportFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentReportFiles.belongsTo(models.students, {
        foreignKey: "student_id",
      });

    }
  }
  StudentReportFiles.init(
    {
      user_id: DataTypes.INTEGER,
      file_path: DataTypes.STRING,
      academic_year: DataTypes.STRING,
      semester: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "tbl_student_report_files",
      modelName: "studentreportfiles",
      underscored: true,
    }
  );
  return StudentReportFiles;
};
