"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ForCountryDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ForCountryDetails.belongsTo(models.forcountry, {
        foreignKey: "for_country_id",
      });
    }
  }
  ForCountryDetails.init(
    {
      for_country_id: DataTypes.INTEGER,
      activity: DataTypes.STRING,
      duration: DataTypes.DOUBLE(3, 1),
      remark: DataTypes.STRING,
      certificate_path: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "forcountrydetails",
      tableName: "tbl_for_country_details",
      underscored: true,
    }
  );
  return ForCountryDetails;
};
