const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const BookReview = models.bookreview;
const Students = models.students;
const Books = models.books;

class BookReviewDao extends SuperDao {
  constructor() {
    super(BookReview);
  }

  async getAllByBookId(bookId) {
    const reviews = await BookReview.findAll({
      where: {
        book_id: bookId,
      },
      include: [
        {
          model: Books,
          attributes: ["id", "title"],
        },
        {
          model: Students,
          attributes: ["id", "full_name"],
        },
      ],
    });

    const total_ratings = await this.getAverageRating();
    return { reviews, total_ratings };
  }

  async getAverageRating() {
    try {
      const result = await BookReview.aggregate("rating", "avg", {
        distinct: false,
      });
      const averageRating = result || 0; // In case there are no reviews, return 0
      return averageRating;
    } catch (error) {
      console.error("Error calculating average rating:", error);
      throw error;
    }
  }

  async getCount(search) {
    return BookReview.count({
      where: {
        [Op.or]: [
          {
            "$book.title$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            rating: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            comment: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Books,
          attributes: ["id", "title"],
        },
        {
          model: Students,
          attributes: ["id", "full_name"],
        },
      ],
    });
  }

  async getBookReviewPage(search, offset, limit) {
    return BookReview.findAll({
      where: {
        [Op.or]: [
          {
            "$book.title$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            rating: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            comment: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: Books,
          attributes: ["id", "title"],
        },
        {
          model: Students,
          attributes: ["id", "full_name"],
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = BookReviewDao;
