"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentReports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      StudentReports.belongsTo(models.studentclass, {
				foreignKey: 'student_class_id',
			});

			StudentReports.hasMany(models.numberreport, {
				foreignKey: 'student_report_id',
			});

			StudentReports.hasMany(models.narrativereport, {
				foreignKey: 'student_report_id',
			});

			StudentReports.hasMany(models.portofolioreports, {
				foreignKey: 'student_report_id',
			});
			StudentReports.hasMany(models.narrativecomment, {
				foreignKey: 'student_report_id',
			});
    }
  }
  StudentReports.init(
    {
      student_class_id: DataTypes.INTEGER,
      semester: DataTypes.INTEGER,
      number_path: DataTypes.STRING,
      narrative_path: DataTypes.STRING,
      portofolio_path: DataTypes.STRING,
      merged_path: DataTypes.STRING,
      nar_teacher_comments: DataTypes.TEXT,
      nar_parent_comments: DataTypes.TEXT,
      por_teacher_comments: DataTypes.TEXT,
      por_parent_comments: DataTypes.TEXT,
      nar_comments_path: DataTypes.STRING,
      por_comments_path: DataTypes.STRING,
      student_access: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: "studentreports",
      tableName: "tbl_student_reports",
      underscored: true,
    }
  );
  return StudentReports;
};
