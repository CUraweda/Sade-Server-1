"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NarrativeDesc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NarrativeDesc.belongsTo(models.narrativesubcategory, {
        foreignKey: "narrative_sub_cat_id",
      });
      NarrativeDesc.hasMany(models.narrativereport, {
        foreignKey: "narrative_desc_id",
      });
    }
  }
  NarrativeDesc.init(
    {
      narrative_sub_cat_id: DataTypes.INTEGER,
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "narrativedesc",
      tableName: "ref_narrative_desc",
      timestamps: false,
      underscored: true,
    }
  );
  return NarrativeDesc;
};
