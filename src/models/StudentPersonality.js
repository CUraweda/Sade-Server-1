"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentPersonality extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentPersonality.belongsTo(models.studentclass, {
        foreignKey: "student_class_id",
      });
      StudentPersonality.belongsTo(models.personality, {
        foreignKey: "personality_id",
      });
    }
  }
  StudentPersonality.init(
    {
      student_class_id: DataTypes.INTEGER,
      personality_id: DataTypes.INTEGER,
      grade: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "studentpersonality",
      tableName: "tbl_student_personality",
      underscored: true,
    }
  );
  return StudentPersonality;
};
