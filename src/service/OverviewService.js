const httpStatus = require("http-status");
const OverviewDao = require("../dao/OverviewDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class OverviewService {
  constructor() {
    this.overviewDao = new OverviewDao();
  }

  createOverview = async (reqBody) => {
    try {
      let message = "Overview successfully added.";

      let data = await this.overviewDao.create(reqBody);

      if (!data) {
        message = "Failed to create overview.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      if (data.status === "Aktif") {
        await this.overviewDao.setActive(data.id);
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

  updateOverview = async (id, body) => {
    const message = "Overview successfully updated!";

    let rel = await this.overviewDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Overview not found!",
        {}
      );
    }

    const updateData = await this.overviewDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
    if (body.status === "Aktif") {
      await this.overviewDao.setActive(id);
    }
  };

  showOverview = async (id) => {
    const message = "Overview successfully retrieved!";

    let rel = await this.overviewDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Overview not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.overviewDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.overviewDao.getOverviewPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Religion successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  showOverviewActive = async (id) => {
    const message = "Overview successfully retrieved!";

    let rel = await this.overviewDao.getActive();

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Overview not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  setActiveOverview = async (id) => {
    const message = "Overview successfully updated!";

    let rel = await this.overviewDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Overview not found!",
        {}
      );
    }

    const updateData = await this.overviewDao.setActive(id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  deleteOverview = async (id) => {
    const message = "Overview successfully deleted!";

    let rel = await this.overviewDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Overview not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = OverviewService;
