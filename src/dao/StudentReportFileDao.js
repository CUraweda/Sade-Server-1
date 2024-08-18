const SuperDao = require("./SuperDao");
const models = require("../models");

const StudentReportFiles = models.studentreportfiles;
const StudentClass = models.studentclass;
const Student = models.students;

class StudentReportFilesDao extends SuperDao {
  constructor() {
    super(StudentReportFiles);
  }

  async getCount({ student_id, academic, semester, class_ids }) {
    const where = {};

    if (academic) where["academic_year"] = academic;
    if (semester) where["semester"] = semester;
    if (class_ids) {
      const students = await StudentClass.findAll({
        where: {
          class_id: {
            [Op.in]: class_ids,
          },
        },
      });
      where["student_id"] = {
        [Op.in]: students.map((st) => st.student_id),
      };
    }
    if (student_id) where["student_id"] = student_id;

    return StudentReportFiles.count({
      where,
      include: [
        {
          model: Student,
        },
      ],
    });
  }

  async getPage(offset, limit, { student_id, academic, semester, class_ids }) {
    const where = {};

    if (academic) where["academic_year"] = academic;
    if (semester) where["semester"] = semester;
    if (class_ids) {
      const students = await StudentClass.findAll({
        where: {
          class_id: {
            [Op.in]: class_ids,
          },
        },
      });
      where["student_id"] = {
        [Op.in]: students.map((st) => st.student_id),
      };
    }
    if (student_id) where["student_id"] = student_id;

    return StudentReportFiles.count({
      where,
      include: [
        {
          model: Student,
        },
      ],
      offset,
      limit,
      order: [["id", "DESC"]],
    });
  }
}

module.exports = StudentReportFilesDao;
