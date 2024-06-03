"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransactionJournal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionJournal.belongsTo(models.financialpost, {
        foreignKey: "financial_post_id",
      });
      TransactionJournal.belongsTo(models.studentclass, {
        foreignKey: "student_class_id",
      });
      TransactionJournal.belongsTo(models.user, { foreignKey: "operator_id" });
    }
  }
  TransactionJournal.init(
    {
      financial_post_id: DataTypes.INTEGER,
      student_class_id: DataTypes.INTEGER,
      operator_id: DataTypes.INTEGER,
      ref_no: DataTypes.STRING,
      desc: DataTypes.STRING,
      amount: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "transactionjournal",
      tableName: "tbl_transaction_journals",
      underscored: true,
    }
  );
  return TransactionJournal;
};
