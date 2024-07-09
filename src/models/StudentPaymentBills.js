"use strict"
const {Model} = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    class StudentPaymentBills extends Model {
        static associate(models) {
            StudentPaymentBills.belongsTo(models.paymentpost, {
                foreignKey: "payment_post_id"
            })
            StudentPaymentBills.belongsTo(models.classes, {
                foreignKey: "class_id"
            })
            StudentPaymentBills.belongsTo(models.students, {
                foreignKey: "student_id"
            })
        }
    }
    StudentPaymentBills.init(
        {
            name: DataTypes.STRING,
            level: DataTypes.STRING,
            academic_year: DataTypes.STRING,
            total: DataTypes.DOUBLE,
            due_date: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "studentpaymentbills",
            tableName: "tbl_payment_bills",
            underscored: true
        }
    )
    return StudentPaymentBills
}