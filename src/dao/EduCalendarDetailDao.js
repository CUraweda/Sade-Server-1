const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const { fi } = require("date-fns/locale");

const EduCalendarDetail = models.educalendardetails;
const EduCalendar = models.educalendar;

class EduCalendarDetailDao extends SuperDao {
  constructor() {
    super(EduCalendarDetail);
  }

  async getById(id) {
    return EduCalendarDetail.findAll({
      where: { id },
      include: [
        {
          model: EduCalendar,
        },
      ],
    });
  }

  async getByEduId(edu_id, teacher_id, academic) {
    return EduCalendarDetail.findAll({
      where: {
        edu_id,
        teacher_id,
        ...(academic && { "$educalendar.academic_year$": academic })
      },
      include: [
        {
          model: EduCalendar,
        },
      ],
    });
  }
  async getByTeacherId(teacher_id, academic) {
    return EduCalendarDetail.findAll({
      where: {
        teacher_id,
        ...(academic && { "$educalendar.academic_year$": academic })
      },
      include: [
        {
          model: EduCalendar,
        },
      ],
    });
  }

  async getCount(search, filter) {
    return EduCalendarDetail.count({
      where: {
        [Op.or]: [
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
            agenda: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
        ...(filter.academic && { "$educalendar.academic_year$": filter.academic })
      },
      include: [
        {
          model: EduCalendar
        }
      ]
    });
  }

  async getEduCalendarDetailPage(search, offset, limit, filter) {
    return EduCalendarDetail.findAll({
      where: {
        [Op.or]: [
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
            agenda: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
        ...(filter.academic && { "$educalendar.academic_year$": filter.academic })
      },
      include: [
        {
          model: EduCalendar
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = EduCalendarDetailDao;
