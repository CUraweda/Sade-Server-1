const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const TransactionJournal = models.transactionjournal;
const StudentClass = models.studentclass;
const FinancialPost = models.financialpost;
const Users = models.user;
const Students = models.students;

class TransactionJournalDao extends SuperDao {
  constructor() {
    super(TransactionJournal);
  }

  async getCount(search) {
    return TransactionJournal.count({
      where: {
        [Op.or]: [
          {
            "$financialpost.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$financialpost.in_out$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentclass.student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$user.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            ref_no: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            amount: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students,
              attributes: ["id", "full_name"],
            },
          ],
        },
        {
          model: FinancialPost,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Users,
          attributes: ["id", "full_name"],
        },
      ],
    });
  }

  async getTransactionJournalPage(search, offset, limit) {
    return TransactionJournal.findAll({
      where: {
        [Op.or]: [
          {
            "$financialpost.name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$financialpost.in_out$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$studentclass.student.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$user.full_name$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            ref_no: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            desc: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            amount: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Students,
              attributes: ["id", "full_name"],
            },
          ],
        },
        {
          model: FinancialPost,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Users,
          attributes: ["id", "full_name"],
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = TransactionJournalDao;
