"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_weekday", [
      {
        name: "Senin",
      },
      {
        name: "Selasa",
      },
      {
        name: "Rabu",
      },
      {
        name: "Kamis",
      },
      {
        name: "Jumat",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("re_weefkday", null, {});
  },
};
