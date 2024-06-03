const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Book = models.books;

class BookDao extends SuperDao {
  constructor() {
    super(Book);
  }

  async getCount(search) {
    return Book.count({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            publisher: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            writer: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            category: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getBookPage(search, offset, limit) {
    return Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            publisher: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            writer: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            category: {
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
module.exports = BookDao;
