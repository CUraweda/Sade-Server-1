"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ForCountry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ForCountry.hasMany(models.forcountrydetails, {
        foreignKey: "for_country_id",
      });
      ForCountry.belongsTo(models.user, { foreignKey: "user_id" });
    }
  }
  ForCountry.init(
    {
      user_id: DataTypes.INTEGER,
      academic_year: DataTypes.STRING,
      target: DataTypes.DOUBLE(3, 1),
    },
    {
      sequelize,
      modelName: "forcountry",
      tableName: "tbl_for_country",
      underscored: true,
    }
  );
  return ForCountry;
};
