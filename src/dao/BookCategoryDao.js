const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const BookCategory = models.bookcategory;

class BookCategoryDao extends SuperDao {
  constructor() {
    super(BookCategory);
  }

  async getCount(search) {
    return BookCategory.count({
      where: {
        [Op.or]: [
          {
            code: {
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

  async getBookCategoryPage(search, offset, limit) {
    return BookCategory.findAll({
      where: {
        [Op.or]: [
          {
            code: {
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
module.exports = BookCategoryDao;
