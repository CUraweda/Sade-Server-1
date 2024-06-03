"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_employees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employee_no: {
        type: Sequelize.STRING,
      },
      full_name: {
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
      religion: {
        type: Sequelize.STRING,
      },
      marital_status: {
        type: Sequelize.STRING,
      },
      last_education: {
        type: Sequelize.STRING,
      },
      certificate_year: {
        type: Sequelize.STRING,
      },
      is_education: {
        type: Sequelize.STRING,
      },
      major: {
        type: Sequelize.STRING,
      },
      employee_status: {
        type: Sequelize.STRING,
      },
      work_start_date: {
        type: Sequelize.STRING,
      },
      occupation: {
        type: Sequelize.STRING,
      },
      is_teacher: {
        type: Sequelize.STRING,
      },
      duty: {
        type: Sequelize.STRING,
      },
      job_desc: {
        type: Sequelize.STRING,
      },
      grade: {
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
    await queryInterface.dropTable("tbl_employees");
  },
};
