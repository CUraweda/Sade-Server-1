const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const BorrowBook = models.borrowbook;
const Students = models.students;
const Books = models.books;

class BorrowBookDao extends SuperDao {
  constructor() {
    super(BorrowBook);
  }

  async getById(id) {
    return BorrowBook.findAll({
      where: { id },
      include: [
        {
          model: Books,
        },
        {
          model: Students,
        },
      ],
    });
  }

  async getByStudentId(student_id, category) {
    if (category === null || category === undefined || category === "") {
      return BorrowBook.findAll({
        where: { student_id },
        include: [
          {
            model: Books,
          },
          {
            model: Students,
          },
        ],
      });
    }
    return BorrowBook.findAll({
      where: { student_id, "$book.category$": category },
      include: [
        {
          model: Books,
        },
        {
          model: Students,
        },
      ],
    });
  }

  async recapByCategoryByStudentId(id) {
    const studentId = id;
    return BorrowBook.findAll({
      attributes: [
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              'DISTINCT CASE WHEN `book`.`category` = "Wajib" THEN `book`.`id` END'
            )
          ),
          "wajib",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              'DISTINCT CASE WHEN `book`.`category` = "Pilihan" THEN `book`.`id` END'
            )
          ),
          "pilihan",
        ],
      ],
      include: [
        {
          model: Books,
          attributes: [],
        },
      ],
      where: {
        student_id: studentId,
      },
      group: ["book.category"],
    });
  }

  async getCount(search) {
    return BorrowBook.count({
      where: {
        [Op.or]: [
          {
            "$book.title$": {
              [Op.like]: "%" + search + "%",
            },
          },
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
        ],
      },
      include: [
        {
          model: Books,
        },
      ],
    });
  }

  async getBorrowBookPage(search, offset, limit) {
    return BorrowBook.findAll({
      where: {
        [Op.or]: [
          {
            "$book.title$": {
              [Op.like]: "%" + search + "%",
            },
          },
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
        ],
      },
      include: [
        {
          model: Books,
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = BorrowBookDao;
