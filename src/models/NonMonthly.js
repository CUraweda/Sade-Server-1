"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NonMonthly extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NonMonthly.belongsTo(models.studentclass, {
        foreignKey: "student_class_id",
      });
      NonMonthly.belongsTo(models.paymentcategory, {
        foreignKey: "payment_category_id",
      });
    }
  }
  NonMonthly.init(
    {
      student_class_id: DataTypes.INTEGER,
      payment_category_id: DataTypes.INTEGER,
      academic_year: DataTypes.STRING,
      bill_amount: DataTypes.DOUBLE,
      payment_status: DataTypes.STRING,
      payment_date: DataTypes.DATE,
      payment_response: DataTypes.TEXT,
      invoice: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "nonmonthly",
      tableName: "tbl_non_monthly",
      underscored: true,
    }
  );
  return NonMonthly;
};
