const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const NumberReport = models.numberreport;
const StudentReports = models.studentreports;
const Students = models.students;
const StudentClass = models.studentclass;
const Classes = models.classes;
const Subjects = models.subjects;
const StudentPersonality = models.studentpersonality;
const Personality = models.personality;
const ReportSigners = models.reportsigners;
const StudentAttendanceDao = require("./StudentAttendanceDao");

class NumberReportDao extends SuperDao {
  constructor() {
    super(NumberReport);
    this.studentAttendance = new StudentAttendanceDao();
  }

  async getById(id) {
    return NumberReport.findAll({
      where: { id },
      include: [
        {
          model: StudentReports,
          include: [
            {
              model: StudentClass,
              attributes: ["id", "academic_year", "student_id", "class_id"],
              include: [
                {
                  model: Students,
                  attributes: ["id", "nis", "nisn", "full_name", "gender"],
                },
                {
                  model: Classes,
                  attributes: ["id", "class_name"],
                },
              ],
            },
          ],
        },
        {
          model: Subjects,
          attributes: ["id", "level", "code", "name"],
        },
      ],
    });
  }

  async getCount(search) {
    return NumberReport.count({
      where: {
        [Op.or]: [
          {
            "$studentreport.studentclass.student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.studentclass.student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.studentclass.academic_year$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.semester$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade_text: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentReports,
          include: [
            {
              model: StudentClass,
              attributes: ["id", "academic_year", "student_id", "class_id"],
              include: [
                {
                  model: Students,
                  attributes: ["id", "nis", "nisn", "full_name", "gender"],
                },
                {
                  model: Classes,
                  attributes: ["id", "class_name"],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getNumberReportPage(search, offset, limit) {
    return NumberReport.findAll({
      where: {
        [Op.or]: [
          {
            "$studentreport.studentclass.student.nis$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.studentclass.student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.studentclass.academic_year$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentreport.semester$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            grade_text: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentReports,
          include: [
            {
              model: StudentClass,
              attributes: ["id", "academic_year", "student_id", "class_id"],
              include: [
                {
                  model: Students,
                  attributes: ["id", "nis", "nisn", "full_name", "gender"],
                },
                {
                  model: Classes,
                  attributes: ["id", "class_name"],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getByStudentId(id, semester) {
    const formatter = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const personality = await StudentPersonality.findAll({
      where: { "$studentclass.student.id$": id },
      include: [
        {
          model: Personality,
          attributes: ["id", "desc"],
        },
        {
          model: StudentClass,
          attributes: ["id", "academic_year", "student_id", "class_id"],
          include: [
            {
              model: Students,
              attributes: ["id", "nis", "nisn", "full_name", "gender"],
            },
            {
              model: Classes,
              attributes: ["id", "class_name"],
            },
          ],
        },
      ],
    });

    const attendance = await this.studentAttendance.getRecapByStudentId(
      id,
      semester
    );

    const reports = await NumberReport.findAll({
      where: {
        "$studentreport.studentclass.student.id$": id,
        "$studentreport.semester$": semester,
      },
      include: [
        {
          model: StudentReports,
          include: [
            {
              model: StudentClass,
              attributes: ["id", "academic_year", "student_id", "class_id"],
              include: [
                {
                  model: Students,
                  attributes: ["id", "nis", "nisn","full_name", "level", "gender"],
                },
                {
                  model: Classes,
                  attributes: ["id", "class_name"],
                },
              ],
            },
          ],
        },
        {
          model: Subjects,
          attributes: ["id", "level", "code", "name", "threshold"],
        },
      ],
      order: [[{ model: Subjects }, 'id', 'ASC']],
    });

    // Extracting necessary information
    const {
      studentreport: {
        studentclass: {
          class_id = 0,
          academic_year = "",
          class: { class_name } = {},
          student: { full_name, nisn, nis, level } = {},
        } = {},
      } = {},
    } = reports[0] || {};

    const signers = await ReportSigners.findAll({
      where: { class_id: class_id },
    });

    const { head, form_teacher, sign_at } = signers[0] || {};

    // Formatting the result
    const result = {
      full_name,
      nisn,
      level,
      nis,
      class: class_name,
      semester,
      academic_year,
      number_reports: reports.map((report) => ({
        student_report_id: report.studentreport.id,
        subject_id: report.subject.id,
        subject_code: report.subject.code,
        subject_name: report.subject.name,
        grade: formatter.format(parseFloat(report.grade.toFixed(2))),
        grade_text: report.grade_text,
        threshold: formatter.format(
          parseFloat(report.subject.threshold.toFixed(2))
        ),
      })),
      personalities: personality.map((p) => ({
        id: p.id,
        desc: p.personality.desc,
        grade: p.grade,
      })),
      attendances: attendance,
      head,
      form_teacher,
      sign_at,
    };

    return result;
  }

  async filteredByParams(academic, semester, classId) {
    let params = {};

    if (semester) {
      params["$studentreport.semester$"] = semester;
    }
    if (academic) {
      params["$studentreport.studentclass.academic_year$"] = academic;
    }
    if (classId) {
      params["$studentreport.studentclass.class_id$"] = classId;
    }

    return NumberReport.findAll({
      where: params,
      include: [
        {
          model: StudentReports,
          attributes: {
            exclude: ["parent_comments", "createdAt", "updatedAt"],
          },
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
        },
        {
          model: Subjects,
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "ASC"]],
    });
  }
}
module.exports = NumberReportDao;
