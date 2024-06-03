"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Monthly extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Monthly.belongsTo(models.studentclass, {
        foreignKey: "student_class_id",
      });
      Monthly.belongsTo(models.paymentcategory, {
        foreignKey: "payment_category_id",
      });
      Monthly.belongsTo(models.months, {
        foreignKey: "month_id",
      });
    }
  }
  Monthly.init(
    {
      student_class_id: DataTypes.INTEGER,
      month_id: DataTypes.INTEGER,
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
      modelName: "monthly",
      tableName: "tbl_monthly",
      underscored: true,
    }
  );
  return Monthly;
};
