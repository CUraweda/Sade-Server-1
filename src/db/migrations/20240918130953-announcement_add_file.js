"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("tbl_announcements", "file_path", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    queryInterface.addColumn("tbl_announcements", "file_type", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn("tbl_announcements", "file_path");
    queryInterface.removeColumn("tbl_announcements", "file_type");
  },
};
