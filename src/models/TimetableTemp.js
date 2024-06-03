"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TimetableTemp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TimetableTemp.belongsTo(models.classes, { foreignKey: "class_id" });
      TimetableTemp.belongsTo(models.weekday, { foreignKey: "day_id" });
      TimetableTemp.belongsTo(models.subjects, { foreignKey: "subject_id" });
    }
  }
  TimetableTemp.init(
    {
      class_id: DataTypes.INTEGER,
      day_id: DataTypes.INTEGER,
      subject_id: DataTypes.INTEGER,
      semester: DataTypes.INTEGER,
      time_seq: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "timetabletemp",
      tableName: "ref_timetable_temp",
      underscored: true,
    }
  );
  return TimetableTemp;
};
