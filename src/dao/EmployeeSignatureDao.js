const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const EmployeeSignature = models.employeesignature;
const Employees = models.employees
const Classes = models.classes

class EmployeeSignatureDao extends SuperDao {
    constructor() {
        super(EmployeeSignature);
    }

    async checkDataForAdd(data) {
        const { employee_id, headmaster_of, form_teacher_class_id } = data, conditions = []
        if (headmaster_of) conditions.push({ headmaster_of, [Op.not]: { employee_id } });
        if (form_teacher_class_id) conditions.push({ form_teacher_class_id, [Op.not]: { employee_id } });
    
        return EmployeeSignature.findAll({
            where: { [Op.or]: conditions }
        })
    }

    async getCount(filter) {
        let { search } = filter;
        if (!search) search = "";
        return EmployeeSignature.count({
            where: {
                [Op.or]: [
                    {
                        signature_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        headmaster_of: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter;
        if (!search) search = "";
        return EmployeeSignature.findAll({
            where: {
                [Op.or]: [
                    {
                        signature_name: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        headmaster_of: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            include: [
                {
                    model: Employees,
                    required: false
                },
                {
                    model: Classes,
                    required: false
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = EmployeeSignatureDao;
