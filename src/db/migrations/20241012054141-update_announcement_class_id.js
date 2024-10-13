'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tbl_announcements', 'class_ids', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_announcements', 'class_ids');
    // await queryInterface.addColumn('tbl_announcements', 'class_id', 'class_id', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   onDelete: "CASCADE",
    //   references: {
    //     model: "ref_classes",
    //     key: "id",
    //   },
    // });
  }
};
