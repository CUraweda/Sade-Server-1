"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentClass.belongsTo(models.classes, {
        foreignKey: "class_id",
      });
      StudentClass.belongsTo(models.students, { foreignKey: "student_id" });
      StudentClass.hasMany(models.studentattendance, {
        foreignKey: "student_class_id",
      });
      StudentClass.hasMany(models.studenttask, {
        foreignKey: "student_class_id",
      });
      StudentClass.hasMany(models.monthly, {
        foreignKey: "student_class_id",
      });
      StudentClass.hasMany(models.studentpersonality, {
        foreignKey: "student_class_id",
      });
      StudentClass.hasMany(models.nonmonthly, {
        foreignKey: "student_class_id",
      });
      StudentClass.hasMany(models.studentreports, {
				foreignKey: 'student_class_id',
			});
      StudentClass.hasMany(models.wastecollection, {
         foreignKey: 'student_class_id' 
      });
    }
  }
  StudentClass.init(
    {
      academic_year: DataTypes.STRING,
      student_id: DataTypes.INTEGER,
      class_id: DataTypes.INTEGER,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "studentclass",
      tableName: "tbl_students_in_class",
      underscored: true,
    }
  );
  return StudentClass;
};
