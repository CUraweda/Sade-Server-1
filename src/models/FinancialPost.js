"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FinancialPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FinancialPost.hasMany(models.transactionjournal, {
        foreignKey: "financial_post_id",
      });
    }
  }
  FinancialPost.init(
    {
      name: DataTypes.STRING,
      in_out: DataTypes.STRING,
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "financialpost",
      tableName: "ref_financial_posts",
      underscored: true,
    }
  );
  return FinancialPost;
};
