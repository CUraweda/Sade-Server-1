const httpStatus = require("http-status");
const NarrativeDescDao = require("../dao/NarrativeDescDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class NarrativeDescService {
  constructor() {
    this.narrativeDescDao = new NarrativeDescDao();
  }

  createNarrativeDesc = async (reqBody) => {
    try {
      let message = "Narrative desc successfully added.";

      let data = await this.narrativeDescDao.create(reqBody);

      if (!data) {
        message = "Failed to create narrative desc.";
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

  updateNarrativeDesc = async (id, body) => {
    const message = "Narrative desc successfully updated!";

    let rel = await this.narrativeDescDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative desc not found!",
        {}
      );
    }

    const updateData = await this.narrativeDescDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showNarrativeDesc = async (id) => {
    const message = "Narrative desc successfully retrieved!";

    let rel = await this.narrativeDescDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative desc not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showNarrativeDescBySubCatId = async (id) => {
    const message = "Narrative desc successfully retrieved!";

    let rel = await this.narrativeDescDao.getBySubNarrativeId(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative desc not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.narrativeDescDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.narrativeDescDao.getNarrativeDescPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Narrative desc successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteNarrativeDesc = async (id) => {
    const message = "Narrative desc successfully deleted!";

    let rel = await this.narrativeDescDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Narrative desc not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = NarrativeDescService;
