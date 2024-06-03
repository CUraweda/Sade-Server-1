"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserChat.belongsTo(models.user, { as: "idUser", foreignKey: "user_id" });
      UserChat.belongsTo(models.user, {
        as: "withUser",
        foreignKey: "with_id",
      });
    }
  }
  UserChat.init(
    {
      user_id: DataTypes.INTEGER,
      with_id: DataTypes.INTEGER,
      unique_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "userchat",
      tableName: "tbl_user_chats",
      timestamps: false,
      underscored: true,
    }
  );
  return UserChat;
};
