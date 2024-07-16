"use strict";
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WasteOfficer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			WasteOfficer.belongsTo(models.classes, {
				foreignKey: 'class_id',
			});
			WasteOfficer.belongsTo(models.students, {
				foreignKey: 'student_id',
			});
		}
    }
    WasteOfficer.init(
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
return WasteOfficer;
};