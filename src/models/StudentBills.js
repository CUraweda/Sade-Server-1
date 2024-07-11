"use strict"
const {Model, DataTypes} = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    class StudentBills extends Model {
        static associate(models) {
            StudentBills.belongsTo(models.students, {
                foreignKey: "student_id"
            })
            StudentBills.belongsTo(models.studentpaymentbills, {
                foreignKey: "payment_bill_id"
            })
        }
    }
    StudentBills.init(
        {
            evidence_path: DataTypes.STRING,
            paidoff_at: DataTypes.STRING,
            status: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "studentbills",
            tableName: "tbl_student_bills",
            underscored: true

        }
    )
    return StudentBills
}