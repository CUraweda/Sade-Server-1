const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const NarrativeSubCategory = models.narrativesubcategory;
const NarrativeCategory = models.narrativecategory;
const StudentClass = models.studentclass;

class NarrativeSubCategoryDao extends SuperDao {
  constructor() {
    super(NarrativeSubCategory);
  }

  async getById(id) {
    return NarrativeSubCategory.findAll({
      where: { id },
      include: [
        {
          model: NarrativeCategory,
        },
      ],
    });
  }

  async getByCategoryId(id) {
    return NarrativeSubCategory.findAll({
      where: { narrative_cat_id: id },
      // include: [
      //   {
      //     model: NarrativeCategory,
      //   },
      // ],
    });
  }

  async getCount(search) {
    return NarrativeSubCategory.count({
      where: {
        [Op.or]: [
          {
            "$narrativecategory.category$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            sub_category: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: NarrativeCategory,
        },
        {
          model: StudentClass,
        },
      ],
    });
  }

  async getNarrativeSubCategoryPage(search, offset, limit) {
    return NarrativeSubCategory.findAll({
      where: {
        [Op.or]: [
          {
            "$narrativecategory.category$": {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            code: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            sub_category: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      include: [
        {
          model: NarrativeCategory,
        },
        {
          model: StudentClass,
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }
}
module.exports = NarrativeSubCategoryDao;
