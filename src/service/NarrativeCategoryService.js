const httpStatus = require("http-status");
const NarrativeCategoryDao = require("../dao/NarrativeCategoryDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class NarrativeCategoryService {
  constructor() {
    this.narrativeCategoryDao = new NarrativeCategoryDao();
  }

  createNarrativeCategory = async (reqBody) => {
    try {
      let message = "Narrative Category successfully added.";

      let data = await this.narrativeCategoryDao.create(reqBody);

      if (!data) {
        message = "Failed to create Narrative Category.";
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

  updateNarrativeCategory = async (id, body) => {
    const message = "Narrative Category successfully updated!";

    let cl = await this.narrativeCategoryDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Book category not found!",
        {}
      );
    }

    const updateData = await this.narrativeCategoryDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showNarrativeCategory = async (id) => {
    const message = "Narrative Category successfully retrieved!";

    let cl = await this.narrativeCategoryDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Category not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showNarrativeCategoryByClassId = async (id) => {
    const result = await this.narrativeCategoryDao.getByClassId(id);
    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Narrative Category successfully retrieved.",
      result
    );
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.narrativeCategoryDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.narrativeCategoryDao.getNarrativeCategoryPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Narrative Category successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteNarrativeCategory = async (id) => {
    const message = "BookC ategory successfully deleted!";

    let cl = await this.narrativeCategoryDao.deleteByWhere({ id });

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative Category not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
}

module.exports = NarrativeCategoryService;
