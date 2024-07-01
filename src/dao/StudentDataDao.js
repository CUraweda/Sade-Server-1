const SuperDao = require("./SuperDao")
const models = require("../models")
const  { Op, where } = require("sequelize")

const StudentData = models.studentdata
const Students = models.students

class StudentDataDao extends SuperDao {
    constructor() {
        super(StudentData)
    }
    async getByStudentId(student_id) {
        return StudentData.findAll({
          where: {
            student_id: student_id,
          },
          order: [["id", "DESC"]],
        });
    }

    async findByClass(classes) {
        return StudentData.findAll({
          where: {
            class: classes,
          },
        });
    }
    async getCount(search) {
        return StudentData.count({
            where: {
                [Op.or]: [
                    {
                        "$student.nis$": {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    {
                        "$student.full_name$": {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                ],
            },
            include: [
                {
                    model: Students,
                    as: 'student',
                    attributes: ["id", "nis", "full_name", "class"],
                },
            ], 
        })
    }
    async getStudentDataPage(search, offset, limit) {
        try {
            console.log("Dao", search);
    
            const result = await StudentData.findAll({
                where: {
                    [Op.or]: [
                        { '$student.nis$': { [Op.like]: `%${search}%` } },
                        { '$student.full_name$': { [Op.like]: `%${search}%` } },
                        { name: { [Op.like]: `%${search}%` } },
                        { nis: { [Op.like]: `%${search}%` } },
                    ],
                },
                include: [
                    {
                        model: Students,
                        as: 'student',
                        attributes: ['id', 'nis', 'nisn', 'full_name', 'gender'],
                    },
                ],
                offset: offset,
                limit: limit,
                order: [['id', 'DESC']],
            });
    
            return result;
        } catch (error) {
            console.error('Error in getStudentDataPage:', error);
            throw error;
        }
    }
    
}

module.exports = StudentDataDao;