const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const LessonPlan = models.lessonplan;

class LessonPlanDao extends SuperDao {
    constructor() {
        super(LessonPlan);
    }
    getById = async (id) => {
        return LessonPlan.findAll({
            where: { id },
            include: [
                {
                    model: LessonPlan,
                },
            ],
        });
    }
    getLessonPlanPage = async (search, offset, limit) => {
        return LessonPlan.findAll({
            where: {
                [Op.or]: [
                    {
                        subjects_name: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        assignments_name: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        class: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        description: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "ASC"]],
        });
    }


    getCount = async (search) => {
        return LessonPlan.count({
            where: {
                [Op.or]: [
                    {
                        assignments_name: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        subjects_name: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        class: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        description: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                ],
            },
        });
    }
}

module.exports = LessonPlanDao;
