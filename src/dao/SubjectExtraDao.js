const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const subjectExtra = models.subjectextra;
const FormExtra = models.formextra
class SubjectExtraDao extends SuperDao {
    constructor() {
        super(subjectExtra);
    }

    async getAll(level) {
        return subjectExtra.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${level}%`
                        }
                    }
                ]
            },
            order: [["id", "asc"]]
        })
    }

    async getCount(search) {
        return subjectExtra.count({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                ],
            },
        });
    }

    async getPage(filter, offset, limit) {
        const { search, employee } = filter
        return subjectExtra.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}
module.exports = SubjectExtraDao;
