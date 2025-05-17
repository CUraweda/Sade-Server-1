const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, Sequelize } = require("sequelize");

const LessonPlan = models.lessonplan;
const Classes = models.classes;
const Subject = models.subjects
const Employees = models.employees

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

    getByEmployee = async () => {
        return Employees.findAll({
            where: { is_teacher:  { in: ["G", "Guru", "Yes"] }},
            attributes: ["full_name"],
            include: [
                {
                    model: LessonPlan,
                    attributes: ["id","subject_id", "class_id"],
                    required: false,
                },
            ],
        })
    }

    getCounterLessonPlan = async () => {
        const subject_count = await Subject.count()
        const class_count = await Classes.count({ where: { is_active: true } })
        return { subject_count, class_count }
    }
}

module.exports = LessonPlanDao;
