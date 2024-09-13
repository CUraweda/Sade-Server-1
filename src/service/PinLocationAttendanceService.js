const httpStatus = require("http-status");
const PinLocationDao = require("../dao/PinLocationAttendanceDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class PinLocationService {
  constructor() {
    this.pinLocationDao = new PinLocationDao();
  }

  createPinLocation = async (reqBody) => {
    try {
      let message = "Pin Location successfully added.";

      let data = await this.pinLocationDao.create(reqBody);

      if (!data) {
        message = "Failed to create PinLocation.";
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

  updatePinLocation = async (id, body) => {
    const message = "PinLocation successfully updated!";

    let rel = await this.pinLocationDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "PinLocation not found!",
        {}
      );
    }

    const updateData = await this.pinLocationDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showPinLocation = async (id) => {
    const message = "Pin Location successfully retrieved!";

    let rel = await this.pinLocationDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Pin Location not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.pinLocationDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.pinLocationDao.getPinLocationPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Pin Location successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deletePinLocation = async (id) => {
    const message = "Pin Location successfully deleted!";

    let rel = await this.pinLocationDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Pin Location not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = PinLocationService;
