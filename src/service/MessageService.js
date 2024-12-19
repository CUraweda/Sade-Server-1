const httpStatus = require("http-status");
const MessageDao = require("../dao/MessageDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const UserChatDao = require("../dao/UserChatDao");
const { v4: uuidv4 } = require("uuid");

class MessageService {
  constructor() {
    this.messageDao = new MessageDao();
    this.userChatDao = new UserChatDao();
  }

  createMessage = async (reqBody) => {
    try {
      let message = "Message successfully added.";

      const checkData = await this.userChatDao.checkBetweenUser(
        reqBody.user_id,
        reqBody.with_id
      );

      const uuid = uuidv4();

      if (checkData.length === 0) {
        const userChatOne = await this.userChatDao.create({
          user_id: reqBody.user_id,
          with_id: reqBody.with_id,
          unique_id: uuid,
        });

        const userChatTwo = await this.userChatDao.create({
          user_id: reqBody.with_id,
          with_id: reqBody.user_id,
          unique_id: uuid,
        });

        reqBody.unique_id = uuid;

      } else {
        reqBody.unique_id = checkData[0].unique_id;
      }

      const body = {
        unique_id: reqBody.unique_id,
        sender_id: reqBody.user_id,
        message: reqBody.message,
        is_read: 0,
      };

      const data = await this.messageDao.create(body);

      if (!data) {
        message = "Failed to create message.";
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

  showMessage = async (id) => {
    const message = "Message successfully retrieved!";

    let cl = await this.messageDao.findById(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Message not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  showConvesationByUId = async (id) => {
    const message = "Message successfully retrieved!";

    let cl = await this.messageDao.findConversation(id);

    if (!cl) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Message not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, cl);
  };

  updateMessage = async (id, reqBody) => {
    try {
      let message = "Message successfully updated.";
      let data = await this.messageDao.updateWhere(
        {
          is_read: reqBody.is_read,
        },
        { id }
      );

      if (!data) {
        message = "Failed to update message.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      return responseHandler.returnSuccess(httpStatus.OK, message, data);
    } catch (e) {
      logger.error(e);
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };
}

module.exports = MessageService;
