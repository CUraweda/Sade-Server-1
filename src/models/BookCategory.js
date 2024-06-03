"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookCategory.hasMany(models.books, {
        foreignKey: "book_cat_id",
      });
    }
  }
  BookCategory.init(
    {
      code: DataTypes.STRING,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "ref_book_categories",
      modelName: "bookcategory",
      timestamps: false,
      underscored: true,
    }
  );
  return BookCategory;
};
