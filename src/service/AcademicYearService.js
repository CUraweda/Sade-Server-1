const httpStatus = require("http-status");
const AcademicYearDao = require("../dao/AcademicYearDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class AcademicYearService {
  constructor() {
    this.academicYearDao = new AcademicYearDao();
  }

  createAcademicYear = async (reqBody) => {
    try {
      let message = "Academic year successfully added.";

      reqBody.name = reqBody.start + "/" + reqBody.end;

      let data = await this.academicYearDao.create(reqBody);

      if (!data) {
        message = "Failed to create academic year.";
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

  updateAcademicYear = async (id, body) => {
    const message = "Academic year successfully updated!";

    let sense = await this.academicYearDao.findById(id);

    if (!sense) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Academic year not found!",
        {}
      );
    }

    const updateData = await this.academicYearDao.updateWhere(
      {
        start: body.start,
        end: body.end,
        name: body.start + "/" + body.end,
        status: body.status,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showAcademicYear = async (id) => {
    const message = "Academic year successfully retrieved!";

    let ay = await this.academicYearDao.findById(id);

    if (!ay) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Academic year not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, ay);
  };

  async showPage(page, limit, search, offset) {
    const totalRows = await this.academicYearDao.getCount(search);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.academicYearDao.getAcademicYearPage(
      search,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Academic year successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteAcademicYear = async (id) => {
    const message = "Academic year successfully deleted!";

    let ay = await this.academicYearDao.deleteByWhere({ id });

    if (!ay) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Academic year not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, ay);
  };
}

module.exports = AcademicYearService;
