const httpStatus = require("http-status");
const FormTeacherDao = require("../dao/FormTeacherDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class FormTeacherService {
  constructor() {
    this.formTeacherDao = new FormTeacherDao();
  }

  createFormTeacher = async (reqBody) => {
    try {
      let message = "Form Teacher successfully added.";

      let data = await this.formTeacherDao.create(reqBody);

      if (!data) {
        message = "Failed to create Form Teacher.";
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

  updateFormTeacher = async (id, body) => {
    const message = "Form Teacher successfully updated!";

    let rel = await this.formTeacherDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Form Teacher not found!",
        {}
      );
    }

    const updateData = await this.formTeacherDao.updateWhere(
      {
        class_id: body.class_id,
        employee_id: body.employee_id,
        academic_year: body.academic_year,
        is_active: body.is_active,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showFormTeacher = async (id) => {
    const message = "Form Teacher successfully retrieved!";

    let rel = await this.formTeacherDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Form Teacher not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, filter, offset) {
    const totalRows = await this.formTeacherDao.getCount(filter);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.formTeacherDao.getFormTeacherPage(
      search,
      offset,
      limit,
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Form Teacher successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteFormTeacher = async (id) => {
    const message = "Form Teacher successfully deleted!";

    let rel = await this.formTeacherDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Form Teacher not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };
}

module.exports = FormTeacherService;
