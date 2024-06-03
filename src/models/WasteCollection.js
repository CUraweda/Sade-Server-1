"use strict";
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WasteCollection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WasteCollection.belongsTo(models.studentclass, {
        foreignKey: "student_class_id",
      });
      WasteCollection.belongsTo(models.weekday, {
        foreignKey: "day_id",
      });
      WasteCollection.belongsTo(models.wastetypes, {
        foreignKey: "waste_type_id",
      });
    }
  }
  WasteCollection.init(
    {
      student_class_id: DataTypes.INTEGER,
      collection_date: DataTypes.DATE,
      day_id: DataTypes.INTEGER,
      waste_type_id: DataTypes.INTEGER,
      weight: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "wastecollection",
      tableName: "tbl_waste_collection",
      underscored: true,
    }
  );
  return WasteCollection;
};
