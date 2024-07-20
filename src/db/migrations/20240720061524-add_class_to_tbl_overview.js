'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_overviews", "class_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "ref_classes",
        key: "id"
      },
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_overviews", "class_id")
  }
};
