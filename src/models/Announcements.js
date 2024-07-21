"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Announcements extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			Announcements.belongsTo(models.classes, {
				foreignKey: 'class_id',
			});
    }
  }
  Announcements.init(
    {
      date_start: DataTypes.DATE,
      date_end: DataTypes.DATE,
      announcement_desc: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "announcements",
      tableName: "tbl_announcements",
      underscored: true,
    }
  );
  return Announcements;
};
