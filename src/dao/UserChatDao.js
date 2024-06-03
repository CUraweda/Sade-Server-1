const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const UserChat = models.userchat;
const Users = models.user;
const Messages = models.messages;

class UserChatDao extends SuperDao {
  constructor() {
    super(UserChat);
  }

  async findUserChatByUserId(id) {
    return UserChat.findAll({
      where: {
        user_id: id,
      },
      include: [
        {
          model: Users,
          as: "idUser",
          attributes: ["id", "full_name"],
        },
        {
          model: Users,
          as: "withUser",
          attributes: ["id", "full_name"],
        },
      ],
    });
  }

  async findUserChatByUserIdDetails(id) {
    const user_chat = await UserChat.findAll({
      where: {
        user_id: id,
      },
      include: [
        {
          model: Users,
          as: "idUser",
          attributes: ["id", "full_name"],
        },
        {
          model: Users,
          as: "withUser",
          attributes: ["id", "full_name"],
        },
      ],
    });

    const uniqueIds = user_chat.map((item) => item.unique_id);

    const messages = await Messages.findAll({
      where: {
        unique_id: {
          [Op.in]: uniqueIds,
        },
      },
    });

    // Grouping user_chat and messages by unique_id
    const userChatGrouped = user_chat.reduce((acc, curr) => {
      acc[curr.unique_id] = acc[curr.unique_id] || [];
      acc[curr.unique_id].push(curr);
      return acc;
    }, {});

    const messagesGrouped = messages.reduce((acc, curr) => {
      acc[curr.unique_id] = acc[curr.unique_id] || [];
      acc[curr.unique_id].push(curr);
      return acc;
    }, {});

    // Combining userChatGrouped and messagesGrouped into result object
    const result = Object.keys(userChatGrouped).map((unique_id) => ({
      user_chat: userChatGrouped[unique_id],
      messages: messagesGrouped[unique_id] || [], // If no messages found for unique_id, provide an empty array
    }));

    return result;
  }

  async findUserBetweenId(userId, withId) {
    const user_chat = await UserChat.findAll({
      where: {
        user_id: userId,
        with_id: withId,
      },
      include: [
        {
          model: Users,
          as: "idUser",
          attributes: ["id", "full_name"],
        },
        {
          model: Users,
          as: "withUser",
          attributes: ["id", "full_name"],
        },
      ],
    });

    const uniqueIds = user_chat.map((item) => item.unique_id);

    const messages = await Messages.findAll({
      where: {
        unique_id: {
          [Op.in]: uniqueIds,
        },
      },
    });

    // Grouping user_chat and messages by unique_id
    const userChatGrouped = user_chat.reduce((acc, curr) => {
      acc[curr.unique_id] = acc[curr.unique_id] || [];
      acc[curr.unique_id].push(curr);
      return acc;
    }, {});

    const messagesGrouped = messages.reduce((acc, curr) => {
      acc[curr.unique_id] = acc[curr.unique_id] || [];
      acc[curr.unique_id].push(curr);
      return acc;
    }, {});

    // Combining userChatGrouped and messagesGrouped into result object
    const result = Object.keys(userChatGrouped).map((unique_id) => ({
      user_chat: userChatGrouped[unique_id],
      messages: messagesGrouped[unique_id] || [], // If no messages found for unique_id, provide an empty array
    }));

    return result;
  }

  async checkBetweenUser(userId, withId) {
    const user_chat = await UserChat.findAll({
      where: {
        user_id: userId,
        with_id: withId,
      },
    });
    return user_chat;
  }
}
module.exports = UserChatDao;
