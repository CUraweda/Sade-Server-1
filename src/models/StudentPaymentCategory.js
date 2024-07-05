"use strict"
const {Model} = require("sequelize")
const StudentData = require("./StudentData")

module.exports = (sequelize, DataTypes) => {
    class StudentPaymentCategory extends Model {
        static associate(models) {
            StudentPaymentCategory.belongsTo(models.paymentpost, {
                foreignKey: "payment_post_id"
            })
        }
    }
    StudentPaymentCategory.init(
        {
            description: DataTypes.STRING,
            post: DataTypes.STRING,
            due_date: DataTypes.DATE,
            total: DataTypes.DOUBLE,
        },
        {
            sequelize,
            modelName: "studentpaymentcategory",
            tableName: "tbl_payment_category",
            underscored: true
        }
    )
    return StudentPaymentCategory
}