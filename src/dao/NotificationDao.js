const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Notification = models.notifications;
const User = models.user;

class NotificationDao extends SuperDao {
  constructor() {
    super(Notification);
  }

  async getByUserId(user_id) {
    return Notification.findAll({
      where: {
        user_id: user_id,
      },
      order: [
        ["is_read", "ASC"], // Mengurutkan data yang belum di baca
        ["created_at", "DESC"], // Tanggal terbaru akan muncul pertama
      ],
    });
  }

  async getCount(search) {
    return Notification.count({
      where: {
        [Op.or]: [
          {
            "$user.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            title: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
          //   {
          //     read_at: {
          //       [Op.like]: "%" + search + "%",
          //     },
          //   },
        ],
      },
      include: [{ model: User }],
    });
  }

  async getNotificationPage(search, offset, limit) {
    return Notification.findAll({
      where: {
        [Op.or]: [
          {
            "$user.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            title: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
          //   {
          //     read_at: {
          //       [Op.like]: "%" + search + "%",
          //     },
          //   },
        ],
      },
      include: [{ model: User }],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = NotificationDao;
