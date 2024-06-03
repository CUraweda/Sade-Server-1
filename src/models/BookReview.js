"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookReview.belongsTo(models.books, {
        foreignKey: "book_id",
      });
      BookReview.belongsTo(models.students, {
        foreignKey: "student_id",
      });
    }
  }
  BookReview.init(
    {
      book_id: DataTypes.INTEGER,
      student_id: DataTypes.INTEGER,
      rating: DataTypes.DOUBLE,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "bookreview",
      tableName: "tbl_book_reviews",
      underscored: true,
    }
  );
  return BookReview;
};
