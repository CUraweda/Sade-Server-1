"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_task_categories", [
      {
        desc: "Work With Parents",
      },
      {
        desc: "Project Kelompok",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ref_task_categories", null, {});
  },
};
