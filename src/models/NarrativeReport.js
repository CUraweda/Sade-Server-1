"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NarrativeReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NarrativeReport.belongsTo(models.narrativedesc, {
        foreignKey: "narrative_desc_id",
      });
      NarrativeReport.belongsTo(models.studentreports, {
        foreignKey: "student_report_id",
      });
    }
  }
  NarrativeReport.init(
    {
      student_report_id: DataTypes.INTEGER,
      narrative_desc_id: DataTypes.INTEGER,
      grade: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "narrativereport",
      tableName: "tbl_narrative_reports",
      underscored: true,
    }
  );
  return NarrativeReport;
};
