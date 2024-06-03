const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const PortofolioReport = models.portofolioreports;
const StudentReport = models.studentreports;
const StudentClass = models.studentclass;
const Classes = models.classes;

class PortofolioReportDao extends SuperDao {
  constructor() {
    super(PortofolioReport);
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

    return PortofolioReport.findAll({
      where: params,
      include: [
        {
          model: StudentReport,
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
              ],
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });
  }

  async getByStudentReportId(student_report_id, type) {
    return PortofolioReport.findOne({
      where: {
        student_report_id,
        type,
      },
    });
  }

  async getAllByStudentReportId(student_report_id) {
    return PortofolioReport.findAll({
      where: {
        student_report_id: student_report_id,
      },
    });
  }
}
module.exports = PortofolioReportDao;
