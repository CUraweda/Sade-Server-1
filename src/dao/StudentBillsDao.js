const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, where } = require("sequelize");

const StudentBills = models.studentbills
const Students = models.students;
const PaymentBills = models.studentpaymentbills

class StudentBillsDao extends SuperDao {
    constructor() {
        super(StudentBills)
    }
    async getByStudentId(student_id) {
        return StudentBills.findAll({
          where: {
            student_id: student_id,
          },
          order: [["id", "DESC"]],
        });
    }
    async findById(id) {
        return StudentBills.findAll({
          where: {
            id: id,
          },
        });
    }
    async getCount(search) {
        return StudentBills.count({
            where: {
                [Op.or]: [
                    {"$student.full_name$": { [Op.like]: "%" + search + "%"}},
                ]
            },
            include: [
                {
                    model: Students,
                    as: 'student',
                    attributes: ["id", "nis", "full_name", "class"]
                },
                {
                    model: PaymentBills,
                    as: 'studentpaymentbill',
                    attributes: ["id","student_id"]
                }
            ]
        })
    }
    async getStudentBillsPage(search,offset,limit) {
        try {
            const result = await StudentBills.findAll({
                where: {
                    [Op.or]: [
                        {"$student.full_name$": {[Op.like]: "%" + search + "%"}},
                        {evidence_path: {[Op.like]: "%" + search + "%"}},
                        {paidoff_att: {[Op.like]: "%" + search + "%"}},
                        {status: {[Op.like]: "%" + search + "%"}},
                    ]
                },
                include: [
                    {
                        model: Students,
                        as: 'student',
                        attributes: ["id", "nis", "full_name", "class"]
                    },
                    {
                        model: PaymentBills,
                        as: 'studentpaymentbill',
                        attributes: ["id","student_id"]
                    }
                ]
            })
        } catch (error) {
            console.error('Error in getStudentPaymentBillsPage:', error);
            throw error;
        }
    }
}
module.exports = StudentBillsDao