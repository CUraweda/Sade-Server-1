const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const NarrativeComment = models.narrativecomment;
const StudentClass = models.studentclass;
const StudentReports = models.studentreports;
// const Students = models.students;

class NarrativeCommentDao extends SuperDao {
  constructor() {
    super(NarrativeComment);
  }
  async findByStudentId(id, semester, academic) {
    return NarrativeComment.findAll({
      where: {
        "$studentreport.studentclass.student_id$": id,
        "$studentreport.studentclass.is_active$": "Ya",
        "$studentreport.studentclass.academic_year$": academic,
        "$studentreport.semester$": semester,
      },
      include: [
        {
          model: StudentReports,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: StudentClass,
              attributes: ["id", "academic_year", "student_id", "class_id"],
            },
          ],
        },
      ],
    });
  }

  async findByStudentReportId(id, semester, academic) {
    return NarrativeComment.findAll({
      where: {
        "$studentreport.id$": id,
      },
      include: [
        {
          model: StudentReports,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: StudentClass,
              attributes: ["id", "academic_year", "student_id", "class_id"],
            },
          ],
        },
      ],
    });
  }
}
module.exports = NarrativeCommentDao;
