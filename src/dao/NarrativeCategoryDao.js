const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const NarrativeCategory = models.narrativecategory;
const Classes = models.classes;

class NarrativeCategoryDao extends SuperDao {
  constructor() {
    super(NarrativeCategory);
  }

  async getByClassId(id) {
    return NarrativeCategory.findAll({
      where: {
        class_id: id,
      },
    });
  }

  async getCount(search) {
    return NarrativeCategory.count({
      where: {
        [Op.or]: [
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$class.class_name$": {
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
      include: [
        {
          model: Classes,
        },
      ],
    });
  }

  async getNarrativeCategoryPage(search, offset, limit) {
    return NarrativeCategory.findAll({
      where: {
        [Op.or]: [
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            "$class.class_name$": {
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
      include: [
        {
          model: Classes,
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = NarrativeCategoryDao;
