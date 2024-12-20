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

  async getCount(search, filters) {
    const { class_id, class_ids, academic } = filters
    const where = {
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
    }

    let classIds = []

    if (class_ids?.length) classIds = class_ids

    if (class_id) classIds = [class_id]

    if (academic) where["$forcountry.academic_year$"] = academic

    return ForCountryDetail.count({
      where,
      include: [
        {
          model: ForCountry,
          required: true,
          include: [
            {
              model: User,
              attributes: ["full_name"],
            },
          ]
        },
        {
          model: Student,
          attributes: ["id", "full_name"],
          required: classIds.length > 0,
          include: [
            {
              model: models.studentclass,
              required: classIds.length > 0,
              ...(classIds.length && {
                where: {
                  class_id: {
                    [Op.in]: classIds
                  }
                },
              })
            }
          ]
        }
      ],
    });
  }

  async getForCountryDetailPage(search, offset, limit, filters) {
    const { class_id, class_ids, academic } = filters
    const where = {
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
    }

    if (academic) where["$forcountry.academic_year$"] = academic

    let classIds = []

    if (class_ids?.length) classIds = class_ids

    if (class_id) classIds = [class_id]


    return ForCountryDetail.findAll({
      where,
      include: [
        {
          model: ForCountry,
          required: true,
          include: [
            {
              model: User,
              attributes: ["full_name"],
            },
          ]
        },
        {
          model: Student,
          attributes: ["id", "full_name"],
          required: classIds.length > 0,
          include: [
            {
              model: models.studentclass,
              required: classIds.length > 0,
              ...(classIds.length && {
                where: {
                  class_id: {
                    [Op.in]: classIds
                  }
                },
              })
            }
          ]
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = ForCountryDetailDao;
