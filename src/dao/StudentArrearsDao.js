const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const Students = models.students
const StudentBills = models.studentbills
const PaymentBills = models.studentpaymentbills

class ArrearsDao extends SuperDao{
    async getById(id) {
        return StudentBills.findAll({
        where: {
            id: id,
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

    async getCount(search) {
        return StudentBills.count({
            
            where: {
                [Op.or]: [
                    {"$student.full_name$": { [Op.like]: "%" + search + "%"}},
                    {"$student.nis$": { [Op.like]: "%" + search + "%"}},
                    {"$studentpaymentbill.name$": { [Op.like]: "%" + search + "%"}},
                    {status: { [Op.like]: "%" + search + "%"}},
                    {"$studentpaymentbill.due_date$": { [Op.like]: "%" + search + "%"}},
                ]
            },
            include: [
                {
                    model: Students,
                    as: 'student',
                    attributes: ["full_name", "nis"]
                },
                {
                    model: PaymentBills,
                    as: 'studentpaymentbill',
                    attributes: ["name","due_date"]
                }
            ]
        })
    }
    async getStudentBillsPage(search,offset,limit) {
        try {
            const result = await StudentBills.findAll({
                where: {
                    [Op.or]: [
                        {"$student.full_name$": { [Op.like]: "%" + search + "%"}},
                        {"$student.nis$": { [Op.like]: "%" + search + "%"}},
                        {"$studentpaymentbill.name$": { [Op.like]: "%" + search + "%"}},
                        { status : { [Op.like]: "%" + search + "%"}},
                        {"$studentpaymentbill.due_date$": { [Op.like]: "%" + search + "%"}},
                    ]    
                },
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
                        attributes: ["name","due_date", "class_id"]
                    }
                ]
            })

            return result;
        } catch (error) {
            console.error('Error in getStudentPaymentBillsPage:', error);
            throw error;
        }
    }

    
    async exportToExcel(search, offset, limit) {
        try {
            const response = await this.getStudentBillsPage(search, offset, limit);
            const data = response.map(item => ({
                ...item.dataValues,
                student: item.dataValues.student.dataValues,
                studentpaymentbill: item.dataValues.studentpaymentbill.dataValues
            }));
            console.log("Data Json", data);
            
            const worksheetData = data.map(item => ({
                'Name': item.student.full_name,
                'NIS': item.student.nis,
                'Pembayaran': item.studentpaymentbill.name,
                'Status': item.status,
                'Jatuh Tempo': item.studentpaymentbill.due_date
            }));

            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(worksheetData);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Arrears Data');

            const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            return buffer;
        } catch (error) {
            console.error('Error exporting data to Excel:', error);
            throw error;
        }
    }

}

module.exports = ArrearsDao;
