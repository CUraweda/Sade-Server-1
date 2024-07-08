const SuperDao = require("./SuperDao")
const models = require("../models")
const {Op} = require("sequelize")
const { defineScript } = require("redis")

const StudentPaymentPost = models.studentpaymentpost
const PaymentPost = models.paymentpost
const PaymentCategory = models.paymentcategory

class StudentPaymentPostDao extends SuperDao {
    constructor() {
        super(StudentPaymentPost)
    }
    
    async getCount(search) {
        return StudentPaymentPost.count({
            where: {
                [Op.or]: [
                    {
                        "$paymentpost.name$": {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        "$paymentcategory.billing_cycle$": {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                ],
            },
            include: [
                {
                    model: PaymentPost,
                    as: 'paymentpost',
                    attributes: ["id", "name", "desc"],
                },
                {
                    model: PaymentCategory,
                    as: "paymentcategory",
                    attributes: ["id", "payment_post_id", "academic_year", "payment_type", "billing_cycle", "level"]
                },
            ], 
        })
    }
    async getStudentPaymentPostPage(search, offset, limit) {
        try {    
            const result = await StudentPaymentPost.findAll({
                where: {
                    [Op.or]: [
                        { '$paymentpost.name$': { [Op.like]: `%${search}%` } },
                        { '$paymentcategory.billing_cycle$': { [Op.like]: `%${search}%` } },
                        { description: { [Op.like]: `%${search}%` } },
                        { category: { [Op.like]: `%${search}%` } },
                    ],
                },
                include: [
                    {
                        model: PaymentPost,
                        as: 'paymentpost',
                        attributes: ["id", "name", "desc"],
                    },
                    {
                        model: PaymentCategory,
                        as: "paymentcategory",
                        attributes: ["id", "payment_post_id", "academic_year", "payment_type", "billing_cycle", "level"]
                    },
                ],
                offset: offset,
                limit: limit,
                order: [['id', 'DESC']],
            });
    
            return result;
        } catch (error) {
            console.error('Error in getStudentPaymentPost:', error);
            throw error;
        }
    }
}

module.exports = StudentPaymentPostDao