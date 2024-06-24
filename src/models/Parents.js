"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Parents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Parents.belongsTo(models.students, { foreignKey: "student_id" });
    }
  }
  Parents.init(
    {
      student_id: DataTypes.INTEGER,
      parent_type: DataTypes.STRING,
      name: DataTypes.STRING,
      nationality: DataTypes.STRING,
      religion: DataTypes.STRING,
      marriage_to: DataTypes.INTEGER,
      in_age: DataTypes.INTEGER,
      relationship_to_student: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      com_priority: DataTypes.STRING,
      last_education: DataTypes.STRING,
      salary: DataTypes.DOUBLE,
      field_of_work: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      latitude: DataTypes.DOUBLE,
      longitude: DataTypes.DOUBLE
    },
    {
      sequelize,
      tableName: "tbl_parents",
      modelName: "parents",
      underscored: true,
    }
  );
  return Parents;
};
