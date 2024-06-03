const httpStatus = require("http-status");
const MessageService = require("../service/MessageService");
const UserChatService = require("../service/UserChatService");
const logger = require("../config/logger");

class MessageController {
  constructor() {
    this.messageService = new MessageService();
    this.userChatService = new UserChatService();
  }

  create = async (req, res) => {
    try {
      const resData = await this.messageService.createMessage(req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  show = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.messageService.showMessage(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  showConversationByUid = async (req, res) => {
    try {
      var id = req.params.id;

      const resData = await this.messageService.showConvesationByUId(id);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  update = async (req, res) => {
    const id = req.params.id;

    try {
      const resData = await this.messageService.updateMessage(id, req.body);

      res.status(resData.statusCode).send(resData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = MessageController;
