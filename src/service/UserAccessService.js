const httpStatus = require("http-status");
const UserAccessDao = require("../dao/UserAccessDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class UserAccessService {
  constructor() {
    this.userAccessDao = new UserAccessDao();
  }

  createUserAccess = async (reqBody) => {
    try {
      let message = "User Access successfully added.";

      let check = await this.userAccessDao.getCountByWhere({ 
        user_id: reqBody.user_id, 
        student_id: reqBody.student_id 
      })

      if (check) return responseHandler.returnError(httpStatus.BAD_REQUEST, "User access already linked")

      let data = await this.userAccessDao.create(reqBody);

      if (!data) {
        message = "Failed to create User Access.";
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

  updateUserAccess = async (id, body) => {
    const message = "User Access successfully updated!";

    let rel = await this.userAccessDao.findById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User Access not found!",
        {}
      );
    }

    const updateData = await this.userAccessDao.updateWhere(
      {
        user_id: body.user_id,
        student_id: body.student_id,
      },
      { id }
    );

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showUserAccess = async (id) => {
    const message = "User Access successfully retrieved!";

    let rel = await this.userAccessDao.getById(id);

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User Access not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  async showPage(page, limit, search, offset, filter) {
    const totalRows = await this.userAccessDao.getCount(search, filter);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.userAccessDao.getUserAccessPage(
      search,
      offset,
      limit,
      filter
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "User Access successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteUserAccess = async (id) => {
    const message = "User Access successfully deleted!";

    let rel = await this.userAccessDao.deleteByWhere({ id });

    if (!rel) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User Access not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, rel);
  };

  showByUserId = async (id) => {
    const message = "User Access successfully retrieved!";

    let dt = await this.userAccessDao.findByUserId(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User Access not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };
}

module.exports = UserAccessService;
