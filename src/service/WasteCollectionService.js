const httpStatus = require("http-status");
const WasteCollectionDao = require("../dao/WasteCollectionDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const xlsx = require("xlsx");

class WasteCollectionService {
  constructor() {
    this.wasteCollectionDao = new WasteCollectionDao();
  }

  createWasteCollection = async (reqBody) => {
    try {
      let message = "Waste Collection successfully added.";

      const date = new Date(reqBody.collection_date);
      const dayIndex = date.getDay();
      const body = {
        student_class_id: reqBody.student_class_id,
        collection_date: reqBody.collection_date,
        day_id: dayIndex,
        waste_type: reqBody.waste_type,
        weight: reqBody.weight,
      };

      let data = await this.wasteCollectionDao.create(body);

      if (!data) {
        message = "Failed to create Waste Collection.";
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

  updateWasteCollection = async (id, body) => {
    const message = "Waste Collection successfully updated!";

    let rel = await this.wasteCollectionDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste Collection not found!",
        {}
      );
    }

    const updateData = await this.wasteCollectionDao.updateWhere(
      {
        student_class_id: body.student_class_id,
        collection_date: body.collection_date,
        day_id: new Date(body.collection_date).getDay(),
        waste_type_id: body.waste_type_id,
        weight: body.weight,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showWasteCollection = async (id) => {
    const message = "Waste Collection successfully retrieved!";

    let rel = await this.wasteCollectionDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste Collection not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.wasteCollectionDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.wasteCollectionDao.getWasteCollectionPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Waste Collection successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  async getWasteCollectionByFilter(waste_type_id, class_id, start_date, end_date, page, limit, search, offset) {
    const filterOptions = {
        waste_type_id: waste_type_id || null,
        class_id: class_id || null,
        start_date: start_date || null,
        end_date: end_date || null
    };
    const totalRows = await this.wasteCollectionDao.getFilteredCount(filterOptions);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.wasteCollectionDao.getByFilter(filterOptions);
    
    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Waste Collection successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteWasteCollection = async (id) => {
    const message = "Waste Collection successfully deleted!";

    let rel = await this.wasteCollectionDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste Collection not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showRecapHistory = async (id) => {
    const message = "Waste Collection successfully retrieved!";

    let rel = await this.wasteCollectionDao.recapHistoryByStudentId(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste Collection not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showRecapStudentInClass = async (id) => {
    const message = "Waste Collection successfully retrieved!";

    let data = await this.wasteCollectionDao.recapStudentClass(id);

    if (!data) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste Collection not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, data);
  };

  showCollectionPerWeekbyStudentId = async (id) => {
    const message = "Waste Collection successfully retrieved!";

    let rel = await this.wasteCollectionDao.collectionPerWeekByStudentId(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste Collection not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showRecapPerWeekByStudentId = async (id) => {
    const message = "Waste Collection successfully retrieved!";

    let rel = await this.wasteCollectionDao.recapPerWeekByStudentId(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste Collection not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  importFromExcel = async (req) => {
    try {
      let message = "Waste collection in class successfully imported.";

      const workbook = xlsx.readFile(req.file.path);

      // Assuming there is only one sheet in the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      console.log(jsonData);
      let data = await this.wasteCollectionDao.bulkCreate(jsonData);

      if (!data) {
        message = "Failed to add waste collection.";
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

  showTargetAchievementByStudentId = async (id, is_current) => {
    const message = "Waste Collection successfully retrieved!";

    console.log("Service", is_current);

    let rel = await this.wasteCollectionDao.targetAchievement(id, is_current);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Waste Collection not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = WasteCollectionService;
