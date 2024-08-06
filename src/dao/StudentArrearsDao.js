const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const { formatDateForSQL } = require("../helper/utils");

const Students = models.students
const StudentBills = models.studentbills
const PaymentBills = models.studentpaymentbills
const StudentClass = models.studentclass
const PaymentPosts = models.paymentpost;

class ArrearsDao extends SuperDao{
    async getById(id) {
        return StudentBills.findAll({
        where: {
            id: id,
        },
        order: [["id", "DESC"]],
        attributes: ["id", "paidoff_at"],
        include: [
            {
                model: Students,
                as: 'student',
                attributes: ["full_name", "nis"]
            },
            {
                model: PaymentBills,
                as: 'studentpaymentbill',
                attributes: ["name","due_date", "class_id"]
                
            }
        ]
    })
    }

    async getByStudentId(student_id) {
        return StudentBills.findAll({
        where: {
            student_id: student_id,
        },
        order: [["id", "DESC"]],
        include: [
            {
                model: Students,
                as: 'student',
                attributes: ["full_name", "nis"]
            },
            {
                model: PaymentBills,
                as: 'studentpaymentbill',
                attributes: ["name","due_date", "class_id"]
                
            }
        ]
    })
    }

    async getByClassId(class_id) {
        return StudentBills.findAll({
        where: {
            "$studentpaymentbill.class_id$": class_id,
        },
        order: [["id", "DESC"]],
        include: [
            {
                model: Students,
                as: 'student',
                attributes: ["full_name", "nis"]
            },
            {
                model: PaymentBills,
                as: 'studentpaymentbill',
                attributes: ["name","due_date", "class_id"]

            }
        ]
    })
    }

    async getCount(search, classId, filters) {
        const where = {
            status: { [Op.like]: "belum lunas" },
            ["$studentpaymentbill.due_date$"]: {
                [Op.lte]: formatDateForSQL(new Date())
            },
            [Op.or]: [
                {"$student.full_name$": { [Op.like]: "%" + search + "%"}},
                {"$student.nis$": { [Op.like]: "%" + search + "%"}},
                {"$studentpaymentbill.name$": { [Op.like]: "%" + search + "%"}},
                {"$studentpaymentbill.due_date$": { [Op.like]: "%" + search + "%"}},
            ]    
        }

        if (filters.post_payment_id) where['$studentpaymentbill.payment_post_id$'] = filters.post_payment_id
        
        if (classId) {
            const students = await StudentClass.findAll({
                where: {
                    class_id: classId
                }
            })
            where['student_id'] = {
                [Op.in]: students.map(st => st.student_id)
            }
        }

        return StudentBills.count({
            where,
            include: [
                {
                    model: Students,
                    as: 'student',
                    attributes: ["full_name", "nis"]
                },
                {
                    model: PaymentBills,
                    as: 'studentpaymentbill',
                    attributes: ["name","due_date"],
                    include: [
                        {
                            model: PaymentPosts,
                            as: "paymentpost",
                            attributes: ["name", "billing_cycle"]
                        }
                    ]
                }
            ]
        })
    }
    async getStudentBillsPage(search,offset,limit, classId, filters) {
        const where = {
            status: { [Op.like]: "belum lunas" },
            ["$studentpaymentbill.due_date$"]: {
                [Op.lte]: formatDateForSQL(new Date())
            },
            [Op.or]: [
                {"$student.full_name$": { [Op.like]: "%" + search + "%"}},
                {"$student.nis$": { [Op.like]: "%" + search + "%"}},
                {"$studentpaymentbill.name$": { [Op.like]: "%" + search + "%"}},
                {"$studentpaymentbill.due_date$": { [Op.like]: "%" + search + "%"}},
            ]    
        }

        if (filters.post_payment_id) where['$studentpaymentbill.payment_post_id$'] = filters.post_payment_id
        
        if (classId) {
            const students = await StudentClass.findAll({
                where: {
                    class_id: classId
                }
            })
            where['student_id'] = {
                [Op.in]: students.map(st => st.student_id)
            }
        }

        try {
            const result = await StudentBills.findAll({
                where,
                attributes: ["id", "status", "student_id", "payment_bill_id"],
                include: [
                    {
                        model: Students,
                        as: 'student',
                        attributes: ["full_name", "nis"]
                    },
                    {
                        model: PaymentBills,
                        as: 'studentpaymentbill',
                        attributes: ["name","due_date"],
                        include: [
                            {
                                model: PaymentPosts,
                                as: "paymentpost",
                                attributes: ["name", "billing_cycle"]
                            }
                        ]
                    }
                ],
                offset: offset,
                limit: limit,
                order: [["id", "DESC"]],
            })

            return result;
        } catch (error) {
            console.error('Error in getStudentPaymentBillsPage:', error);
            throw error;
        }
    }
}

module.exports = ArrearsDao;
