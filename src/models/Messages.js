"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Messages.belongsTo(models.user, {
        foreignKey: "sender_id",
      });
    }
  }
  Messages.init(
    {
      unique_id: DataTypes.UUID,
      sender_id: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      is_read: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "messages",
      tableName: "tbl_messages",
      underscored: true,
    }
  );
  return Messages;
};
