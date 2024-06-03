"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Personality extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Personality.hasMany(models.studentpersonality, {
        foreignKey: "personality_id",
      });
    }
  }
  Personality.init(
    {
      desc: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "ref_personality",
      modelName: "personality",
      timestamps: false,
      underscored: true,
    }
  );
  return Personality;
};
