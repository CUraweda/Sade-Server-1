const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const ForCountry = models.forcountry;
const ForCountryDetail = models.forcountrydetails;

class ForCountryDao extends SuperDao {
  constructor() {
    super(ForCountry);
  }

  async getAllByUserId(user_id, academic) {
    return ForCountry.findAll({
      where: {
        user_id: user_id,
        academic_year: academic,
      },
      include: [
        {
          model: ForCountryDetail,
        },
      ],
    });
  }

  async findById(id) {
    return ForCountry.findOne({
      where: { id },
      include: [
        {
          model: models.user,
          attributes: ["full_name", "avatar"]
        }
      ],
    })
  }

    async getCount(search, filters) {
      const where = {
        [Op.or]: [
          {
            ["$user.full_name$"]: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      }

      if (filters.academic) where["academic_year"] = filters.academic

      return ForCountry.count({
        where,
        include: [
          {
            model: models.user,
            attributes: ["full_name", "avatar"]
          }
        ],
      });
    }

    async getForCountryPage(search, offset, limit, filters) {
      const where = {
        [Op.or]: [
          {
            ["$user.full_name$"]: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      }

      if (filters.academic) where["academic_year"] = filters.academic

      return ForCountry.findAll({
        where,
        include: [
          {
            model: models.user,
            attributes: ["full_name", "avatar"]
          }
        ],
        offset: offset,
        limit: limit,
        order: [["id", "DESC"]],
      });
    }
}
module.exports = ForCountryDao;
