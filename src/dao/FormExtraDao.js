const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const FormExtra = models.formextra;
const Employees = models.employees;
const SubjectExtra = models.subjectextra;

class FormExtraDao extends SuperDao {
    constructor() {
        super(FormExtra);
    }

    async getById(id) {
        return FormExtra.findAll({
            where: { id },
            include: [
                {
                    model: SubjectExtra,
                },
                {
                    model: Employees,
                },
            ],
        });
    }

    async getCount(filter) {
        const { academic_year, search, is_active } = filter
        const conditions = {
            [Op.or]: [
                {
                    "$employee.full_name$": {
                        [Op.like]: "%" + search + "%",
                    },
                }
            ]
        }

        if (academic_year) {
            conditions.academic_year = {
                [Op.like]: academic_year,
            };
        }

        if (is_active !== undefined) {
            conditions.is_active = {
                [Op.eq]: is_active,
            };
        }

        return FormExtra.count({
            where: conditions,
            include: [
                {
                    model: Employees,
                },
                {
                    model: SubjectExtra,
                },
            ],
        });
    }

    async getPage(filter, offset, limit) {
        const { academic_year, search, is_active } = filter
        const conditions = {
            [Op.or]: [
                {
                    "$employee.full_name$": {
                        [Op.like]: "%" + search + "%",
                    },
                }
            ]
    }

        if (academic_year) {
            conditions.academic_year = {
                [Op.like]: academic_year,
            };
        }

        if (is_active !== undefined) {
            conditions.is_active = {
                [Op.eq]: is_active,
            };
        }

        return FormExtra.findAll({
            where: conditions,
            include: [
                {
                    model: Employees,
                },
                {
                    model: SubjectExtra,
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}
module.exports = FormExtraDao;
