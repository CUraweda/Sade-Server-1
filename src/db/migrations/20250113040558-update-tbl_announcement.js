'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tabelDesc = await queryInterface.describeTable("tbl_announcements")
    if (tabelDesc.class_id) await queryInterface.removeColumn("tbl_announcements", "class_id")
    await queryInterface.removeColumn("tbl_announcements", 'class_ids');
    await queryInterface.addColumn('tbl_announcements', 'class_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "ref_classes",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_announcements', 'class_id');
    await queryInterface.addColumn("tbl_announcements", 'class_ids', {
      type: Sequelize.JSON,
      allowNull: true
    })
}
};
