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

  //   async getCount(search) {
  //     return ForCountry.count({
  //       where: {
  //         [Op.or]: [
  //           {
  //             code: {
  //               [Op.like]: "%" + search + "%",
  //             },
  //           },
  //           {
  //             name: {
  //               [Op.like]: "%" + search + "%",
  //             },
  //           },
  //         ],
  //       },
  //     });
  //   }

  //   async getForCountryPage(search, offset, limit) {
  //     return ForCountry.findAll({
  //       where: {
  //         [Op.or]: [
  //           {
  //             code: {
  //               [Op.like]: "%" + search + "%",
  //             },
  //           },
  //           {
  //             name: {
  //               [Op.like]: "%" + search + "%",
  //             },
  //           },
  //         ],
  //       },
  //       offset: offset,
  //       limit: limit,
  //       order: [["id", "DESC"]],
  //     });
  //   }
}
module.exports = ForCountryDao;
