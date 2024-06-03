"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PortofolioReports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PortofolioReports.belongsTo(models.studentreports, {
        foreignKey: "student_report_id",
      });
    }
  }
  PortofolioReports.init(
    {
      student_report_id: DataTypes.INTEGER,
      type: DataTypes.STRING,
      file_path: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "portofolioreports",
      tableName: "tbl_portofolio_reports",
      underscored: true,
    }
  );
  return PortofolioReports;
};
