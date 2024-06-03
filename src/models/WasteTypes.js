"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WasteTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WasteTypes.hasMany(models.wastecollection, {
        foreignKey: "waste_type_id",
      });
    }
  }
  WasteTypes.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "ref_wastetypes",
      modelName: "wastetypes",
      timestamps: false,
      underscored: true,
    }
  );
  return WasteTypes;
};
