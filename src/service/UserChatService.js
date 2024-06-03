const httpStatus = require("http-status");
const UserChatDao = require("../dao/UserChatDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class UserChatService {
  constructor() {
    this.userChatDao = new UserChatDao();
  }

  createUserChat = async (reqBody) => {
    try {
      let message = "User chat successfully added.";

      let data = await this.userChatDao.create(reqBody);

      if (!data) {
        message = "Failed to create user chat.";
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

  updateUserChat = async (id, body) => {
    const message = "User chat successfully updated!";

    let cl = await this.userChatDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User chat not found!",
        {}
      );
    }

    const updateData = await this.userChatDao.updateById(body, id);

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  showUserChat = async (id) => {
    const message = "User chat successfully retrieved!";

    let cl = await this.userChatDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User chat not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showUserChatByUserId = async (userId) => {
    const message = "User chat successfully retrieved!";

    let cl = await this.userChatDao.findUserChatByUserId(userId);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User chat not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showUserChatByUserIdDetails = async (userId) => {
    const message = "User chat successfully retrieved!";

    let cl = await this.userChatDao.findUserChatByUserIdDetails(userId);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User chat not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showUserBetweenId = async (userId, withId) => {
    const message = "User chat successfully retrieved!";

    let cl = await this.userChatDao.findUserBetweenId(userId, withId);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User chat not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  deleteUserChat = async (id) => {
    const message = "User chat successfully deleted!";

    let cl = await this.userChatDao.deleteByWhere({ id });

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "User chat not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };
}

module.exports = UserChatService;
