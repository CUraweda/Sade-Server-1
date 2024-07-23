const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const StudentReport = models.studentreports;
const StudentClass = models.studentclass;
const Students = models.students;
const Classes = models.classes;
const Subjects = models.subjects;
const NumberReportDao = require("./NumberReportDao");
const NarrativeReportDao = require("./NarrativeReportDao");

class StudentReportDao extends SuperDao {
  constructor() {
    super(StudentReport);
    this.numberReportDao = new NumberReportDao();
    this.narrativeReportDao = new NarrativeReportDao();
  }

  async getCount(search) {
    return StudentReport.count({
      where: {
        [Op.or]: [
          {
            semester: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nar_parent_comments: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            student_access: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getStudentReportPage(search, semester, offset, limit) {
    return StudentReport.findAll({
      where: {
        [Op.or]: [
          {
            semester: {
              [Op.eq]: semester,
            },
          },
          {
            nar_parent_comments: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            student_access: {
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

  async getByClassId(id, student_access, semester) {
    const where = {
      "$studentclass.class_id$": id,
    }

    if (student_access != undefined) where['student_access'] = student_access == 'null' ? null : student_access
    where['semester'] = semester
    return StudentReport.findAll({
      where,
      include: [
        {
          model: StudentClass,
          attributes: ["id", "academic_year", "student_id", "class_id"],
          include: [
            {
              model: models.students,
              attributes: ["id", "nis", "nisn", "full_name", "gender"],
            },
            {
              model: models.classes,
              attributes: ["id", "class_name"],
            },
          ],
        },
      ],
    });
  }

  async getByStudentId(id, semester) {
    return StudentReport.findAll({
      where: {
        "$studentclass.student_id$": id,
        "$studentclass.is_active$": "Ya",
        semester: semester,
      },
      include: [
        {
          model: StudentClass,
          attributes: ["id", "academic_year", "student_id", "class_id"],
        },
      ],
    });
  }

  async getByStudentIdDetails(id, semester) {
    const sReport = await StudentReport.findAll({
      where: {
        "$studentclass.student_id$": id,
        semester: semester,
      },
      include: [
        {
          model: StudentClass,
          attributes: ["id", "academic_year", "student_id", "class_id"],
        },
      ],
    });

    const numReport = await this.numberReportDao.getByStudentId(id, semester);
    const narReport = await this.narrativeReportDao.getByStudentId(
      id,
      semester
    );
    return Promise.all([sReport, numReport, narReport]);
  }

  async filterByParams(academic, semester, classId) {
    let params = {};

    if (semester) {
      params["$semester$"] = semester;
    }
    if (academic) {
      params["$studentclass.academic_year$"] = academic;
    }
    if (classId) {
      params["$studentclass.class_id$"] = classId;
    }

    return StudentReport.findAll({
      where: params,
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Classes,
              attributes: ["id", "class_name"],
            },
            {
              model: Students,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  }

  async checkReportAccess(key, value) {
    return StudentReport.count({
      where: {
        [key]: value,
        student_access: true,
      },
      include: [
        {
          model: StudentClass,
        }
      ]
    })
  }
}
module.exports = StudentReportDao;
