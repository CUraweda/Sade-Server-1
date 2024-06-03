"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_students", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nis: {
        type: Sequelize.STRING,
      },
      nisn: {
        type: Sequelize.STRING,
      },
      full_name: {
        type: Sequelize.STRING,
      },
      nickname: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      pob: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.DATE,
      },
      nationality: {
        type: Sequelize.STRING,
      },
      religion: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      level: {
        type: Sequelize.STRING,
      },
      class: {
        type: Sequelize.STRING,
      },
      is_active: {
        type: Sequelize.STRING,
      },
      is_transfer: {
        type: Sequelize.STRING,
        defaultValue: "Tidak",
      },
      category: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_students");
  },
};
