"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_narrative_categories", [
      {
        code: "NC-001",
        category: "Tahsin",
      },
      {
        code: "NC-002",
        category: "Akhlak/Perilaku",
      },
      {
        code: "NC-003",
        category: "Kepemimpinan",
      },
      {
        code: "NC-004",
        category: "Kemampuan Berfikir",
      },
      {
        code: "NC-005",
        category: "Islamika",
      },
      {
        code: "NC-006",
        category: "Ilmu Pengetahuan Alam",
      },
      {
        code: "NC-007",
        category: "Matematika",
      },
      {
        code: "NC-008",
        category: "Bahasa Indonesia",
      },
      {
        code: "NC-009",
        category: "Sosial",
      },
      {
        code: "NC-010",
        category: "Sekolah Alam Student Scout (SASS)",
      },
      {
        code: "NC-011",
        category: "Art (Karya Seni)",
      },
      {
        code: "NC-012",
        category: "Bahasa Inggris (English)",
      },
      {
        code: "NC-013",
        category: "Eskul Perkusi",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ref_narrative_categories", null, {});
  },
};
