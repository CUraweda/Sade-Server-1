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
const EmployeeSignature = models.employeesignature
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

  async getCount(search, filters) {
    const { academic, semester, class_id, class_ids, subject_id, report_id } = filters

    const where = {
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
    }

    if (subject_id) where["subject_id"] = subject_id

    if (semester) where["$studentreport.semester$"] = semester

    if (academic) where["$studentreport.studentclass.academic_year$"] = academic

    if (class_ids?.length) where["$studentreport.studentclass.class_id$"] = { [Op.in]: class_ids }

    if (class_id) where["$studentreport.studentclass.class_id$"] = class_id;
    
    if (report_id) where["student_report_id"] = +report_id

    return NumberReport.count({
      where,
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
          attributes: ["id", "name"],
        },
      ],
    });
  }
  
  async getNumberReportPage(search, offset, limit, filters) {
    const { academic, semester, class_id, class_ids, subject_id, report_id } = filters

    const where = {
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
    }

    if (subject_id) where["subject_id"] = subject_id
    if (semester) where["$studentreport.semester$"] = semester
    if (academic) where["$studentreport.studentclass.academic_year$"] = academic
    if (class_ids?.length) where["$studentreport.studentclass.class_id$"] = { [Op.in]: class_ids }
    if (class_id) where["$studentreport.studentclass.class_id$"] = class_id;
    if (report_id) where["student_report_id"] = +report_id

    return NumberReport.findAll({
      where,
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
          attributes: ["id", "name"],
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }

  async getByStudentId(id, semester, strict = false) {
    const formatter = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const student = await Students.findOne({ where: { id } })
    if(!student) return { status: false, note: "Student Tidak Ditemukan" }
    
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

    // if( strict && personality.length < 1) return { status: false, note: "Student Personality Tidak Ditemukan" }

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

    
    if( strict && reports.length < 1) return { status: false, note: "Number Report Tidak Ditemukan" }

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

    // const signers = await ReportSigners.findAll({
    //   where: { class_id: class_id },
    // });

    const signatureKepalaSekolah = await EmployeeSignature.findOne({
      where: { is_headmaster: true, headmaster_of: level }
    })
    const signatureWaliKelas = await EmployeeSignature.findOne({
      where: { is_form_teacher: true, form_teacher_class_id: class_id }
    })

    // if(strict && signers.length < 1) return { status: false, note: "Signers Tidak Ditemukan" }
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
      head: signatureKepalaSekolah,
      form_teacher: signatureWaliKelas,
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
  async deleteAll() {
    try {
      const result = await NumberReport.destroy({
        where: {},
      });
      return result;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}
module.exports = NumberReportDao;
