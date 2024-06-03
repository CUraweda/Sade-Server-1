"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_parents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student_id: {
        type: Sequelize.INTEGER,
      },
      parent_type: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      nationality: {
        type: Sequelize.STRING,
      },
      religion: {
        type: Sequelize.STRING,
      },
      marriage_to: {
        type: Sequelize.INTEGER,
      },
      in_age: {
        type: Sequelize.INTEGER,
      },
      relationship_to_student: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      com_priority: {
        type: Sequelize.STRING,
      },
      last_education: {
        type: Sequelize.STRING,
      },
      salary: {
        type: Sequelize.DOUBLE,
      },
      field_of_work: {
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
    await queryInterface.dropTable("tbl_parents");
  },
};
