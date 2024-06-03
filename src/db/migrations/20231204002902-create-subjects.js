"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ref_subjects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      level: {
        type: Sequelize.STRING,
      },
      code: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      threshold: {
        type: Sequelize.DOUBLE(10, 2),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ref_subjects");
  },
};
