const httpStatus = require("http-status");
const ClassesDao = require("../dao/ClassesDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class ClassesService {
  constructor() {
    this.classesDao = new ClassesDao();
  }

  createClasses = async (reqBody) => {
    try {
      let message = "Classes successfully added.";

      let data = await this.classesDao.create(reqBody);

      if (!data) {
        message = "Failed to create classes.";
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

  updateClasses = async (id, body) => {
    const message = "Classes successfully updated!";

    let cl = await this.classesDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Classes not found!",
        {}
      );
    }

    const updateData = await this.classesDao.updateWhere(
      {
        level: body.level,
        class_name: body.class_name,
        book_target: body.book_target,
        waste_target: body.waste_target,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showClasses = async (id) => {
    const message = "Classes successfully retrieved!";

    let cl = await this.classesDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Classes not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  async showPage(page, limit, filter, offset) {
    const totalRows = await this.classesDao.getCount(filter);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.classesDao.getClassesPage(filter, offset, limit);

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Classes successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteClasses = async (id) => {
    const message = "Classes successfully deleted!";

    let cl = await this.classesDao.deleteByWhere({ id });

    if (!cl) {
      return responseHandler.returnSuccess(httpStatus.OK, "Classes not found!");
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
}

module.exports = ClassesService;
