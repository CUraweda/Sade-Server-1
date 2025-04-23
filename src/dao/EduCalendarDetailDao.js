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
    let { allow_all, teacher_id, only_teacher } = filter
    allow_all = allow_all != "Y" ? false : true
    only_teacher = (only_teacher == "Y")

    return EduCalendarDetail.count({
      where: {
        [Op.and]: [
          {
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
          },
          ...(only_teacher && { only_teacher: true }),
          ...(allow_all ? [
                { [Op.or]: [{ teacher_id: null }, ...(teacher_id ? [{ teacher_id }] : [])] },
            ] : [
                { teacher_id: { [Op.not]: null } },
                ...(teacher_id ? [{ teacher_id }] : []),
            ]),
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
    let { allow_all, teacher_id, only_teacher } = filter
    allow_all = allow_all != "Y" ? false : true
    only_teacher = only_teacher == "Y" ? true : false;

    return EduCalendarDetail.findAll({
      where: {
        [Op.and]: [
          {
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
          },
          ...(only_teacher ?[ { only_teacher: true }] : [{}]),
          ...(allow_all ? [
                { [Op.or]: [{ teacher_id: null }, ...(teacher_id ? [{ teacher_id }] : [])] },
            ] : [
                { teacher_id: { [Op.not]: null } },
                ...(teacher_id ? [{ teacher_id }] : []),
            ]),
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
