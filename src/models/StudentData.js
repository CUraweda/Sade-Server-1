"use strict";
const { Model } = require("sequelize");
const StudentPersonality = require("./StudentPersonality");
module.exports = (sequelize, DataTypes) => {
    class StudentData extends Model {
        static associate(models) {
            StudentData.belongsTo(models.students, {
                foreignKey: "student_id"
            })
        }
    }
    StudentData.init(
        {
            name: DataTypes.STRING,
            nis: DataTypes.STRING,
            class: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "studentdata",
            tableName: "tbl_student_data",
            underscored: true
        }
    )
    return StudentData
}