"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PaymentCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PaymentCategory.belongsTo(models.paymentpost, {
        foreignKey: "payment_post_id",
      });
      PaymentCategory.hasMany(models.monthly, {
        foreignKey: "payment_category_id",
      });
      PaymentCategory.hasMany(models.nonmonthly, {
        foreignKey: "payment_category_id",
      });
    }
  }
  PaymentCategory.init(
    {
      payment_post_id: DataTypes.INTEGER,
      academic_year: DataTypes.STRING,
      payment_type: DataTypes.STRING,
      billing_cycle: DataTypes.STRING,
      level: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "paymentcategory",
      tableName: "ref_payment_category",
      underscored: true,
    }
  );
  return PaymentCategory;
};
