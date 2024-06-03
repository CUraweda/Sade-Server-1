"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NarrativeComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NarrativeComment.belongsTo(models.studentreports, {
        foreignKey: "student_report_id",
      });
      NarrativeComment.belongsTo(models.narrativecategory, {
        foreignKey: "narrative_cat_id",
      });
    }
  }
  NarrativeComment.init(
    {
      student_report_id: DataTypes.INTEGER,
      narrative_cat_id: DataTypes.INTEGER,
      comments: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "narrativecomment",
      tableName: "tbl_narrative_comments",
      underscored: true,
    }
  );
  return NarrativeComment;
};
