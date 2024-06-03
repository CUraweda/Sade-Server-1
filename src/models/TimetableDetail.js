"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TimetableDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TimetableDetail.belongsTo(models.timetable, {
        foreignKey: "timetable_id",
      });

      TimetableDetail.belongsTo(models.weekday, {
        foreignKey: "day_id",
      });
    }
  }
  TimetableDetail.init(
    {
      timetable_id: DataTypes.INTEGER,
      day_id: DataTypes.INTEGER,
      date_at: DataTypes.DATE,
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "timetabledetail",
      tableName: "tbl_timetable_details",
      underscored: true,
    }
  );
  return TimetableDetail;
};
