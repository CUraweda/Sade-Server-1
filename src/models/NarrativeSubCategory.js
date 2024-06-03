"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NarrativeSubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NarrativeSubCategory.belongsTo(models.narrativecategory, {
        foreignKey: "narrative_cat_id",
      });
    }
  }
  NarrativeSubCategory.init(
    {
      narrative_cat_id: DataTypes.INTEGER,
      code: DataTypes.STRING,
      sub_category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "narrativesubcategory",
      tableName: "ref_narrative_sub_categories",
      timestamps: false,
      underscored: true,
    }
  );
  return NarrativeSubCategory;
};
