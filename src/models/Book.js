"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.bookcategory, {
        foreignKey: "book_cat_id",
      });
      Book.hasMany(models.borrowbook, {
        foreignKey: "book_id",
      });
      Book.hasMany(models.bookreview, {
        foreignKey: "book_id",
      });
    }
  }
  Book.init(
    {
      book_cat_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      publisher: DataTypes.STRING,
      writer: DataTypes.STRING,
      qty: DataTypes.INTEGER,
      category: DataTypes.STRING,
      cover: DataTypes.STRING,
    },
    {
      tableName: "tbl_books",
      sequelize,
      modelName: "books",
      underscored: true,
    }
  );
  return Book;
};
