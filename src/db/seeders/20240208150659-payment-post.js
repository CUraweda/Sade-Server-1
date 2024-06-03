"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_payment_post", [
      {
        name: "SPP",
        desc: "Siswa Reguler",
      },
      {
        name: "SPP",
        desc: "ABK dengan Pendamping",
      },
      {
        name: "SPP",
        desc: "ABK tanpa Pendamping",
      },
      {
        name: "DPP",
        desc: "-",
      },
      {
        name: "Biaya Jihad Harta Pertahun",
        desc: "-",
      },
      {
        name: "Seragam",
        desc: "-",
      },
      {
        name: "Asuransi",
        desc: "-",
      },
      {
        name: "Orientasi Orang Tua",
        desc: "-",
      },
      {
        name: "Pendaftaran",
        desc: "-",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
