const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const { formatDateForSQL } = require("../helper/utils");

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
    const where = {
      [Op.or]: [
        {
          announcement_desc: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    }

    if (filters.start_date) where["date_start"] = { [Op.gte]: formatDateForSQL(new Date(filters.start_date)) }
    if (filters.end_date) where["date_end"] = { [Op.lte]: formatDateForSQL(new Date(filters.end_date)) }
    if (filters.class_id) where["class_id"] = filters.class_id

    return Announcement.count({
      where,
    });
  }

  async getAnnouncementPage(search, offset, limit, filters) {
    const where = {
      [Op.or]: [
        {
          announcement_desc: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    }

    if (filters.start_date && filters.end_date) {
      const dates = [formatDateForSQL(new Date(filters.start_date)), formatDateForSQL(new Date(filters.end_date))]
      where[Op.or] = {
        date_start: { [Op.between]: dates },
        date_end: { [Op.between]: dates }
      }
    } 
    if (filters.class_id) where["class_id"] = filters.class_id

    return Announcement.findAll({
      where,
      include: [
        {
          model: Classes,
          attributes: ["id", "class_name"]
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
  async getAllBetween(start, end, classId) {
    const startDate = new Date(start + " 00:00:00");
    const endDate = new Date(end + " 23:59:59");

    const where = {
      [Op.or]: {
        date_start: {
          [Op.between]: [startDate, endDate],
        },
        date_end: {
          [Op.between]: [startDate, endDate],
        },
      }
    }

    if (classId) {
      where[Op.and] = [
        {
          [Op.or]: [
            { class_id: null },
            { class_id: classId }
          ]
        }
      ];
    } 

    return Announcement.findAll({
      where,
    });
  }
}
module.exports = AnnouncementDao;
