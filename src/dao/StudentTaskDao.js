const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const StudentTask = models.studenttask;
const StudentClass = models.studentclass;
const Students = models.students;
const Subjects = models.subjects;
const TaskCategory = models.taskcategory;

class StudentTaskDao extends SuperDao {
  constructor() {
    super(StudentTask);
  }

  async getById(id) {
    return StudentTask.findAll({
      where: { id },
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
          model: Subjects,
        },
        {
          model: TaskCategory,
        },
      ],
    });
  }

  async getByStudentId(student_id, category, academic) {
    if (category === null || category === undefined || category === "") {
      return StudentTask.findAll({
        where: { 
          "$studentclass.student_id$": student_id,
          ...(academic && { "$studentclass.academic_year$": academic })
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
            model: Subjects,
          },
          {
            model: TaskCategory,
          },
        ],
      });
    }

    return StudentTask.findAll({
      where: {
        [Op.or]: [{ "$studentclass.student_id$": student_id }],
        [Op.and]: [{ "$taskcategory.desc$": category }],
        ...(academic && { "$studentclass.academic_year$": academic })
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
          model: Subjects,
        },
        {
          model: TaskCategory,
        },
      ],
    });
  }

  async getCount(search, filters) {
    const { class_id, class_ids, academic } = filters

    const where = {
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
          semester: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          topic: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          characteristic: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          start_date: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          end_date: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          status: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          assign_value: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          feed_fwd: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    }

    if (class_ids?.length) where["$studentclass.class_id$"] = { [Op.in]: class_ids }
    if (academic) where["$studentclass.academic_year$"] = academic
    if (class_id) where["$studentclass.class_id$"] = class_id

    return StudentTask.count({
      where,
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
          model: Subjects,
        },
        {
          model: TaskCategory,
        },
      ],
    });
  }

  async getStudentTaskPage(search, offset, limit, filters) {
    const { class_id, class_ids, academic } = filters

    const where = {
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
          semester: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          topic: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          characteristic: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          start_date: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          end_date: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          status: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          assign_value: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          feed_fwd: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    }

    if (class_ids?.length) where["$studentclass.class_id$"] = { [Op.in]: class_ids }
    if (academic) where["$studentclass.academic_year$"] = academic
    if (class_id) where["$studentclass.class_id$"] = class_id

    return StudentTask.findAll({
      where,
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
          model: Subjects,
        },
        {
          model: TaskCategory,
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }

  async findPreviousFile(id, callback) {
    StudentTask.findOne({ id: id }, (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result.up_file);
      }
    });
  }
}
module.exports = StudentTaskDao;
