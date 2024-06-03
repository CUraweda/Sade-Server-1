"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notifications.belongsTo(models.user, {
        foreignKey: "user_id",
      });
    }
  }
  Notifications.init(
    {
      user_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      desc: DataTypes.STRING,
      is_read: DataTypes.BOOLEAN,
      read_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "notifications",
      tableName: "tbl_notifications",
      underscored: true,
    }
  );
  return Notifications;
};
