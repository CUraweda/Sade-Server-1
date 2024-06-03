"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_months", [
      {
        name: "Juli",
        status: "Aktif",
      },
      {
        name: "Agustus",
        status: "Non-Aktif",
      },
      {
        name: "September",
        status: "Non-Aktif",
      },
      {
        name: "Oktober",
        status: "Non-Aktif",
      },
      {
        name: "November",
        status: "Non-Aktif",
      },
      {
        name: "Desember",
        status: "Non-Aktif",
      },
      {
        name: "Januari",
        status: "Non-Aktif",
      },
      {
        name: "Februari",
        status: "Non-Aktif",
      },
      {
        name: "Maret",
        status: "Non-Aktif",
      },
      {
        name: "April",
        status: "Non-Aktif",
      },
      {
        name: "Mei",
        status: "Non-Aktif",
      },
      {
        name: "Juni",
        status: "Non-Aktif",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ref_months", null, {});
  },
};
