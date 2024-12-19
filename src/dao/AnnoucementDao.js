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
    const where = {
      [Op.or]: [
        {
          announcement_desc: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    };
  
    if (filters.start_date && filters.end_date) {
      const dates = [formatDateForSQL(new Date(filters.start_date)), formatDateForSQL(new Date(filters.end_date))];
      where[Op.and] = [
        {
          date_start: { [Op.between]: dates },
          date_end: { [Op.between]: dates },
        },
      ];
    }
  
      
    if (filters.int_class_id) {
      where[Op.and] = where[Op.and] || [];
      where[Op.and].push(
        Sequelize.literal(`JSON_CONTAINS(class_ids, '[${filters.int_class_id}]')`)
      );
    }
  
    // Optional: Filtering by multiple class_ids, if needed
    // if (filters.class_ids?.length) {
    //   where[Op.and] = where[Op.and] || [];
    //   filters.class_ids.forEach((classId) => {
    //     where[Op.and].push({
    //       class_ids: {
    //         [Op.contains]: [classId],
    //       },
    //     });
    //   });
    // }
  
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
    };

    if (filters.start_date && filters.end_date) {
      const dates = [formatDateForSQL(new Date(filters.start_date)), formatDateForSQL(new Date(filters.end_date))];
      where[Op.or] = {
        date_start: { [Op.between]: dates },
        date_end: { [Op.between]: dates },
      };
    }

    if (filters.int_class_id) {
      where[Op.and] = where[Op.and] || [];
      where[Op.and].push(
        Sequelize.literal(`JSON_CONTAINS(class_ids, '[${filters.int_class_id}]')`)
      );
    }
  

    // if (filters.class_ids?.length) {
    //   where[Op.or] = filters.class_ids.map((classId) => 
    //     Sequelize.literal(`JSON_CONTAINS(class_ids, '["${classId}"]')`)
    //   );
    // }

    return Announcement.findAll({
      where,
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
