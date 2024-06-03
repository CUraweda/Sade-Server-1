"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Achievements extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Achievements.belongsTo(models.students, {
        foreignKey: "student_id",
      });
    }
  }
  Achievements.init(
    {
      student_id: DataTypes.INTEGER,
      achievement_desc: DataTypes.STRING,
      issued_at: DataTypes.DATE,
      certificate_path: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "achievements",
      tableName: "tbl_achievements",
      underscored: true,
    }
  );
  return Achievements;
};
