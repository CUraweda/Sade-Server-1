const httpStatus = require("http-status");
const WasteTypesDao = require("../dao/WasteTypesDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class ReligionService {
  constructor() {
    this.wasteTypesDao = new WasteTypesDao();
  }

  createWasteType = async (reqBody) => {
    try {
      let message = "Waste type successfully added.";

      let data = await this.wasteTypesDao.create(reqBody);

      if (!data) {
        message = "Failed to create waste type.";
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

  updateWasteType = async (id, body) => {
    const message = "Waste type successfully updated!";

    let rel = await this.wasteTypesDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste type not found!",
        {}
      );
    }

    const updateData = await this.wasteTypesDao.updateById(body, id)

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showWasteType = async (id) => {
    const message = "Waste type successfully retrieved!";

    let rel = await this.wasteTypesDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste type not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.wasteTypesDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.wasteTypesDao.getWasteTypesPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Waste type successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteWasteType = async (id) => {
    const message = "Waste type successfully deleted!";

    let rel = await this.wasteTypesDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste type not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = ReligionService;
