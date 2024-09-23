const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const LessonPlan = models.lessonplan;
const Classes = models.classes;

class LessonPlanDao extends SuperDao {
    constructor() {
        super(LessonPlan);
    }

    getById = async (id) => {
        return LessonPlan.findOne({
            where: { id },
            include: {
                model: Classes,
                attributes: ["id", "level", "class_name"],
            },
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
                ],
            },
            include: {
                model: Classes,
                attributes: ["id", "level", "class_name"],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
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
                ],
            },
        });
    }
}

module.exports = LessonPlanDao;
