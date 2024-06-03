"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NarrativeCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NarrativeCategory.hasMany(models.narrativesubcategory, {
        foreignKey: "narrative_cat_id",
      });
      NarrativeCategory.hasMany(models.narrativecomment, {
        foreignKey: "narrative_cat_id",
      });
      NarrativeCategory.belongsTo(models.classes, {
        foreignKey: "class_id",
      });
    }
  }
  NarrativeCategory.init(
    {
      code: DataTypes.STRING,
      class_id: DataTypes.INTEGER,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "narrativecategory",
      tableName: "ref_narrative_categories",
      timestamps: false,
      underscored: true,
    }
  );
  return NarrativeCategory;
};
