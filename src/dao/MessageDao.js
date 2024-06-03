const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Message = models.messages;

class MessageDao extends SuperDao {
  constructor() {
    super(Message);
  }

  async findConversation(unique_id) {
    return Message.findAll({
      where: {
        unique_id: unique_id,
      },
    });
  }
}
module.exports = MessageDao;
