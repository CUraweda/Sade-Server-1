"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReportSigners extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ReportSigners.belongsTo(models.classes, {
        foreignKey: "class_id",
      });
    }
  }
  ReportSigners.init(
    {
      class_id: DataTypes.INTEGER,
      academic_year: DataTypes.STRING,
      semester: DataTypes.INTEGER,
      head: DataTypes.STRING,
      form_teacher: DataTypes.STRING,
      facilitator: DataTypes.STRING,
      sign_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "reportsigners",
      tableName: "tbl_report_signers",
      underscored: true,
    }
  );
  return ReportSigners;
};
