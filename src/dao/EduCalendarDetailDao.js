const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

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

  async getByEduId(edu_id) {
    return EduCalendarDetail.findAll({
      where: { edu_id },
      include: [
        {
          model: EduCalendar,
        },
      ],
    });
  }

  async getCount(search) {
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
      },
    });
  }

  async getEduCalendarDetailPage(search, offset, limit) {
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
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = EduCalendarDetailDao;
