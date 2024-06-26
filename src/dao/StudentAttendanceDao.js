const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const StudentAttendance = models.studentattendance;
const StudentClass = models.studentclass;
const Students = models.students;

class StudentAttendanceDao extends SuperDao {
  constructor() {
    super(StudentAttendance);
  }

  async getById(id) {
    return StudentAttendance.findAll({
      where: { id },
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students,
            },
          ],
        },
      ],
    });
  }

  async getByClassNDate(class_id, att_date) {
    return StudentAttendance.findAll({
      where: {
        "$studentclass.class_id$": class_id,
        att_date: sequelize.literal(`DATE(att_date) = '${att_date}'`), // Ekstrak tanggal dari att_date
      },
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students,
            },
          ],
        },
      ],
    });
  }

  async getByStudentId(student_id) {
    return StudentAttendance.findAll({
      where: { "$studentclass.student_id$": student_id },
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students,
            },
          ],
        },
      ],
    });
  }

  async getByStudentIdMonth(student_id, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return StudentAttendance.findAll({
      where: {
        "$studentclass.student_id$": student_id,
        att_date: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students,
            },
          ],
        },
      ],
    });
  }

  async getAttendanceByStatus(studentId, semester, academic, status) {
    const whereClause = {
      semester: semester,
      status: status,
      "$studentclass.student_id$": studentId,
      "$studentclass.is_active$": "Ya",
    };

    if (academic !== undefined) {
      whereClause["$studentclass.academic_year$"] = academic;
    }

    const attendance = await StudentAttendance.findAll({
      attributes: [
        "status",
        [
          sequelize.fn("COUNT", sequelize.literal("studentattendance.id")),
          "count",
        ],
      ],
      where: whereClause,
      include: [
        {
          model: StudentClass,
          attributes: [], // Exclude attributes from this table
        },
      ],
      group: ["status"],
      raw: true, // Return plain object instead of model instance
    });
    return attendance;
  }

  async getRecapByStudentId(id, semester, academic) {
    const studentId = id;

    const statuses = ["Hadir", "Sakit", "Izin", "Tanpa Keterangan"];

    const attendancePromises = statuses.map((status) => {
      return this.getAttendanceByStatus(studentId, semester, academic, status);
    });

    const [hadir, sakit, izin, alfa] = await Promise.all(attendancePromises);

    const result = {
      hadir: hadir.length > 0 ? hadir[0].count : "0",
      sakit: sakit.length > 0 ? sakit[0].count : "0",
      izin: izin.length > 0 ? izin[0].count : "0",
      tanpa_keterangan: alfa.length > 0 ? alpa[0].count : "0",
    };

    return result;
  }

  async getCount(search) {
    return StudentAttendance.count({
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
            att_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            att_time: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            status: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            remark: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        // Additional models can be included if needed
        {
          model: StudentClass,
          include: [
            {
              model: Students,
            },
          ],
          // Other options related to the association can be specified here
        },
      ],
    });
  }

  async getStudentAttendancePage(search, offset, limit) {
    return StudentAttendance.findAll({
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
            att_date: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            att_time: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            status: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            remark: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        // Additional models can be included if needed
        {
          model: StudentClass,
          include: [
            {
              model: Students,
            },
          ],
          // Other options related to the association can be specified here
        },
      ],
    });
  }
}
module.exports = StudentAttendanceDao;
