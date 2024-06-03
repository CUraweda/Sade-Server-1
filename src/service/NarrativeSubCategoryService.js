const httpStatus = require("http-status");
const NarrativeSubCategoryDao = require("../dao/NarrativeSubCategoryDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class NarrativeSubCategoryService {
  constructor() {
    this.narrativeSubCategoryDao = new NarrativeSubCategoryDao();
  }

  createNarrativeSubCategory = async (reqBody) => {
    try {
      let message = "Narrative Sub Category successfully added.";

      let data = await this.narrativeSubCategoryDao.create(reqBody);

      if (!data) {
        message = "Failed to create Narrative Sub Category.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  updateNarrativeSubCategory = async (id, body) => {
    const message = "Narrative Sub Category successfully updated!";

    let cl = await this.narrativeSubCategoryDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book category not found!",
        {}
      );
    }

    const updateData = await this.narrativeSubCategoryDao.updateWhere(
      {
        narrative_cat_id: body.narrative_cat_id,
        code: body.code,
        sub_category: body.sub_category,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showNarrativeSubCategory = async (id) => {
    const message = "Narrative Sub Category successfully retrieved!";

    let cl = await this.narrativeSubCategoryDao.getById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Sub Category not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showNarrativeSubCategoryByCatId = async (id) => {
    const message = "Narrative Sub Category successfully retrieved!";

    let cl = await this.narrativeSubCategoryDao.getByCategoryId(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Sub Category not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.narrativeSubCategoryDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result =
      await this.narrativeSubCategoryDao.getNarrativeSubCategoryPage(
        search,
        offset,
        limit
      );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Narrative Sub Category successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteNarrativeSubCategory = async (id) => {
    const message = "BookC ategory successfully deleted!";

    let cl = await this.narrativeSubCategoryDao.deleteByWhere({ id });

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Sub Category not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
}

module.exports = NarrativeSubCategoryService;
