const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const StudentPersonality = models.studentpersonality;
const StudentClass = models.studentclass;
const Students = models.students;
const Personality = models.personality;

class StudentPersonalityDao extends SuperDao {
  constructor() {
    super(StudentPersonality);
  }

  async getCount(search) {
    return StudentPersonality.count({
      where: {
        [Op.or]: [
          {
            "$studentclass.student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentclass.student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$personality.desc$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentClass,
          attributes: ["id", "academic_year", "student_id", "class_id"],
          include: [
            {
              model: Students,
              attributes: ["id", "nis", "nisn", "full_name", "gender"],
            },
          ],
        },
        {
          model: Personality,
          attributes: ["id", "desc"],
        },
      ],
    });
  }

  async getStudentPersonalityPage(search, offset, limit) {
    return StudentPersonality.findAll({
      where: {
        [Op.or]: [
          {
            "$studentclass.student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentclass.student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$personality.desc$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentClass,
          attributes: ["id", "academic_year", "student_id", "class_id"],
          include: [
            {
              model: Students,
              attributes: ["id", "nis", "nisn", "full_name", "gender"],
            },
          ],
        },
        {
          model: Personality,
          attributes: ["id", "desc"],
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = StudentPersonalityDao;
