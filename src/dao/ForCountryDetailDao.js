const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ForCountryDetail = models.forcountrydetails;
const ForCountry = models.forcountry;
const User = models.user
const Student = models.students

class ForCountryDetailDao extends SuperDao {
  constructor() {
    super(ForCountryDetail);
  }

  async getById(id) {
    return ForCountryDetail.findOne({
      where: { id },
      include: [
        {
          model: ForCountry,
          include: [
            {
              model: User,
              attributes: ["full_name", "avatar"]
            },
          ]
        }
      ],
    })
  }

  async getByUserId(user_id, academic) {
    return ForCountryDetail.findAll({
      where: {
        "$forcountry.user_id$": user_id,
        "$forcountry.academic_year$": academic,
      },
      include: [
        {
          model: ForCountry,
        },
      ],
    });
  }

  async getDetailsByDate(date, month, year) {
    let queryLike = ""
    if (year) queryLike += year
    if (month) queryLike += `-${month}-`
    if (month && date) queryLike = queryLike.slice(0, -1)
    if (date) queryLike += `-${date}`

    return ForCountryDetail.findAll({
      where: {
        plan_date: {
          [Op.like]: `%${queryLike}%`
        }
      }
    })
  }

  async getCount(search) {
    return ForCountryDetail.count({
      where: {
        [Op.or]: [
          {
            activity: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            duration: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            remark: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
  }

  async getForCountryDetailPage(search, offset, limit) {
    return ForCountryDetail.findAll({
      where: {
        [Op.or]: [
          {
            activity: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            duration: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            remark: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: ForCountry,
          include: [
            {
              model: User,
              attributes: ["full_name"]
            },
          ]
        },
        {
          model: Student,
          attributes: ["full_name"]
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = ForCountryDetailDao;
