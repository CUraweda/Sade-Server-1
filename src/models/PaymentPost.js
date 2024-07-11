"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PaymentPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PaymentPost.hasMany(models.studentpaymentbills, {
        foreignKey: "payment_post_id",
      });
      PaymentPost.hasMany(models.paymentcategory, {
        foreignKey: "payment_post_id",
      });
    }
  }
  PaymentPost.init(
    {
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
      billing_cycle: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "paymentpost",
      tableName: "ref_payment_post",
      underscored: true,
    }
  );
  return PaymentPost;
};
