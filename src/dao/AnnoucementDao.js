const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Announcement = models.announcements;

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

  async getCount(search) {
    return Announcement.count({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class_name: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getAnnouncementPage(search, offset, limit) {
    return Announcement.findAll({
      where: {
        [Op.or]: [
          {
            level: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            class_name: {
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
  async getAllBetween(start, end) {
    const startDate = new Date(start + " 00:00:00");
    const endDate = new Date(end + " 23:59:59");

    return Announcement.findAll({
      where: {
        date_start: {
          [Op.between]: [startDate, endDate],
        },
        date_end: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  }
}
module.exports = AnnouncementDao;
