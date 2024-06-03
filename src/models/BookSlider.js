"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookSlider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BookSlider.init(
    {
      path: DataTypes.STRING,
      title: DataTypes.STRING,
      writer: DataTypes.STRING,
      publisher: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "bookslider",
      tableName: "tbl_book_sliders",
      underscored: true,
    }
  );
  return BookSlider;
};
