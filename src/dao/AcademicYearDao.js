const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const AcademicYear = models.academicyear;

class AcademicYearDao extends SuperDao {
  constructor() {
    super(AcademicYear);
  }

  async getCount(search) {
    return AcademicYear.count({
      where: {
        [Op.or]: [
          {
            start: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            end: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            status: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getAcademicYearPage(search, offset, limit) {
    return AcademicYear.findAll({
      where: {
        [Op.or]: [
          {
            start: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            end: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            status: {
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
module.exports = AcademicYearDao;
