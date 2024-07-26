"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HeadMaster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HeadMaster.belongsTo(models.employees, {
        foreignKey: "employee_id",
      });
    }
  }
  HeadMaster.init(
    {
      employee_id: DataTypes.INTEGER,
      start_academic_year: DataTypes.STRING,
      end_academic_year: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "headmaster",
      tableName: "tbl_headmaster",
      underscored: true,
    }
  );
  return HeadMaster;
};
