const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const { formatDateForSQL } = require("../helper/utils");
const { Sequelize } = require('sequelize');

const Announcement = models.announcements;
const Classes = models.classes

class AnnouncementDao extends SuperDao {
  constructor() {
    super(Announcement);
  }

  async findByClass(id) {
    return Announcement.findAll({
      where: {
        class_id: id
      },
      order: [['date_start', 'DESC']]
    });
  }

  async getCount(search, filters) {
    const { class_ids, start_date, end_date, class_id } = filters
    const dates = [formatDateForSQL(new Date(start_date)), formatDateForSQL(new Date(end_date))];
    const where = {
      [Op.or]: [
        {
          announcement_desc: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
      [Op.and]: [
        ...((start_date && end_date) && [{
          date_start: { [Op.between]: dates },
          date_end: { [Op.between]: dates },
        }]),
        { class_id: { [Op.in]: class_ids } },
      ]
    };

    return Announcement.count({
      where,
    });
  }

  async getAnnouncementPage(search, offset, limit, filters) {
    const { class_ids, start_date, end_date, class_id } = filters
    const dates = [formatDateForSQL(new Date(start_date)), formatDateForSQL(new Date(end_date))];
    const where = {
      [Op.or]: [
        {
          announcement_desc: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
      [Op.and]: [
        ...((start_date && end_date) && [{
          date_start: { [Op.between]: dates },
          date_end: { [Op.between]: dates },
        }]),
        {
          [Op.or]: [
            ...(class_id != "0" ? [{class_id: { [Op.in]: class_ids } }] : [{class_id: null}] ),
            ...(!class_id ? [{ class_id: null }] : [])
          ]
        }
      ]
    };

    return Announcement.findAll({
      where,
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
      include: [
        {
          model: Classes,
          required: false
        }
      ]
    });
  }

  async getAllBetween(start, end, classId) {
    const startDate = new Date(start + " 00:00:00");
    const endDate = new Date(end + " 23:59:59");

    const where = {
      [Op.and]: [
        {
          date_start: {
            [Op.lte]: endDate,
          },
        },
        {
          date_end: {
            [Op.gte]: startDate,
          },
        }
      ]
    }
    

    if (classId) {
      where[Op.and].push(
        {
          [Op.or]: [
            { class_id: null },
            { class_id: classId }
          ]
        }
      )
    }

    return Announcement.findAll({
      where,
      order: [["start_date", "DESC"]]
    });
  }
}
module.exports = AnnouncementDao;
