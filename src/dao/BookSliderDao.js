const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const BookSlider = models.bookslider;

class BookSliderDao extends SuperDao {
  constructor() {
    super(BookSlider);
  }

  async getCount(search) {
    return BookSlider.count({
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
        ],
      },
    });
  }

  async getBookSliderPage(search, offset, limit) {
    return BookSlider.findAll({
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
        ],
      },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = BookSliderDao;
