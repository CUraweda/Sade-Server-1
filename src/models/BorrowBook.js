"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BorrowBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BorrowBook.belongsTo(models.books, {
        foreignKey: "book_id",
      });
      BorrowBook.belongsTo(models.students, {
        foreignKey: "student_id",
      });
    }
  }
  BorrowBook.init(
    {
      student_id: DataTypes.INTEGER,
      book_id: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "tbl_borrow_books",
      modelName: "borrowbook",
      underscored: true,
    }
  );
  return BorrowBook;
};
