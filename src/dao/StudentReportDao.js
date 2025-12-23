const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, literal } = require("sequelize");

const StudentReport = models.studentreports;
const StudentClass = models.studentclass;
const Students = models.students;
const Classes = models.classes;
const Subjects = models.subjects;
const NumberReport = models.numberreport
const NumberReportDao = require("./NumberReportDao");
const NarrativeReportDao = require("./NarrativeReportDao");

class StudentReportDao extends SuperDao {
  constructor() {
    super(StudentReport);
    this.numberReportDao = new NumberReportDao();
    this.narrativeReportDao = new NarrativeReportDao();
  }

  async getCount(search, filters) {
    const { semester, academic, student_access, class_id, class_ids } = filters
    const where = {
      [Op.or]: [
      // {
      //   nar_parent_comments: {
      //     [Op.like]: "%" + search + "%",
      //   },
      // },
      // {
      //   student_access: {
      //     [Op.like]: "%" + search + "%",
      //   },
      // },
        {
          ["$studentclass.student.full_name$"]: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    }

    if (academic) where["$studentclass.academic_year$"] = academic
    if (semester) where["semester"] = semester

    if (student_access != undefined) where['student_access'] = student_access == 'null' ? null : student_access

    if (class_ids?.length) where["$studentclass.class_id$"] = { [Op.in]: class_ids }

    if (class_id) where["$studentclass.class_id$"] = class_id

    return StudentReport.count({
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

  async getStudentReportPage(search, offset, limit, filters) {
    const { semester, academic, student_access, class_id, class_ids } = filters
    const where = {
      [Op.or]: [
      // {
      //   nar_parent_comments: {
      //     [Op.like]: "%" + search + "%",
      //   },
      // },
      // {
      //   student_access: {
      //     [Op.like]: "%" + search + "%",
      //   },
      // },
        {
          ["$studentclass.student.full_name$"]: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    }
    if (academic) where["$studentclass.academic_year$"] = academic

    if (semester) where["semester"] = semester

    if (student_access != undefined) where['student_access'] = student_access == 'null' ? null : student_access

    if (class_ids?.length) where["$studentclass.class_id$"] = { [Op.in]: class_ids }

    if (class_id) where["$studentclass.class_id$"] = class_id

    return StudentReport.findAll({
      where,
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
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

  async getByClassId(id, student_access, semester, academic, filter) {
    const where = {
      "$studentclass.class_id$": id,
    }

    if (student_access != undefined) where['student_access'] = student_access == 'null' ? null : student_access
    if (academic) where["$studentclass.academic_year$"] = academic
    where['semester'] = semester

    const { subject_id } = filter
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
        {
          model: NumberReport,
          attributes: ["id", "subject_id"],
          where: {
            ...(subject_id && { subject_id })
          },
          required: false
        }
      ],
      ...(subject_id && {
        group: ["id"],
        having: literal(`
          COUNT(numberreports.id) = 0
        `)
      }),
      order: [[{ model: StudentClass }, { model: Students }, "full_name", "ASC"]],
    });
  }

  async getByStudentId(id, semester, academic) {
    return StudentReport.findAll({
      where: {
        "$studentclass.student_id$": id,
        // "$studentclass.is_active$": "Ya",
        ...(academic && { "$studentclass.academic_year$": academic }),
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

  async getByStudentIdDetails(id, semester, academic) {
    const sReport = await StudentReport.findAll({
      where: {
        "$studentclass.student_id$": id,
        ...(academic && { "$studentclass.academic_year$": academic }),
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
