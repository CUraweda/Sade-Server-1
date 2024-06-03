"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_roles", [
      {
        code: "ADM",
        name: "Super Admin",
        access_right: null,
      },
      {
        code: "ADU",
        name: "Admin Keuangan",
        access_right: null,
      },
      {
        code: "ADK",
        name: "Admin Kesiswaan",
        access_right: null,
      },
      {
        code: "KSE",
        name: "Kepala Sekolah",
        access_right: null,
      },
      {
        code: "HRD",
        name: "Human Resources Dept",
        access_right: null,
      },
      {
        code: "GUR",
        name: "Guru",
        access_right: null,
      },
      {
        code: "SIS",
        name: "Siswa",
        access_right: null,
      },
      {
        code: "ORT",
        name: "Orang Tua",
        access_right: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ref_roles", null, {});
  },
};
