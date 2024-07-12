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
			WasteCollection.belongsTo(models.classes, {
				foreignKey: 'class_id',
			});
			WasteCollection.belongsTo(models.employees, {
				foreignKey: 'employee_id',
			});
		}
    }
  WasteCollection.init(
    {
      name: DataTypes.STRING,
      class_name: DataTypes.STRING,
      assignment_date: DataTypes.DATEONLY
    },
    {
      sequelize,
      modelName: "wasteofficer",
      tableName: "tbl_waste_officer",
      underscored: true,
    }
  );
return WasteCollection;
};