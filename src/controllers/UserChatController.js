const httpStatus = require("http-status");
const UserChatService = require("../service/UserChatService");
const logger = require("../config/logger");

class UserChatController {
  constructor() {
    this.userChatService = new UserChatService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.userChatService.createUserChat(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.userChatService.updateUserChat(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.userChatService.showUserChat(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByUserId = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.userChatService.showUserChatByUserId(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showByUserIdDetails = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.userChatService.showUserChatByUserIdDetails(
        id
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showUserBetweenId = async (req, res) => {
    try {
      const userId = req.query.userid || 0;
      const withId = req.query.withid || 0;

      const resData = await this.userChatService.showUserBetweenId(
        userId,
        withId
      );

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  delete = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.userChatService.deleteUserChat(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = UserChatController;
