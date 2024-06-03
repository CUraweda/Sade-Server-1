"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_narrative_sub_categories", [
      {
        code: "NSC-001",
        sub_category: "Kualitas Tilawah",
        narrative_cat_id: 1,
      },
      {
        code: "NSC-002",
        sub_category: "Kesopanan",
        narrative_cat_id: 2,
      },
      {
        code: "NSC-003",
        sub_category: "Kejujuran",
        narrative_cat_id: 2,
      },
      {
        code: "NSC-004",
        sub_category: "Keteguhan",
        narrative_cat_id: 2,
      },
      {
        code: "NSC-005",
        sub_category: "Emosi Sosial",
        narrative_cat_id: 2,
      },
      {
        code: "NSC-006",
        sub_category: "Keterampilan Beradaptasi",
        narrative_cat_id: 2,
      },
      {
        code: "NSC-007",
        sub_category: "Kepercayaan Diri",
        narrative_cat_id: 3,
      },
      {
        code: "NSC-008",
        sub_category: "Komunikasi",
        narrative_cat_id: 3,
      },
      {
        code: "NSC-009",
        sub_category: "Manajerial",
        narrative_cat_id: 3,
      },
      {
        code: "NSC-010",
        sub_category: "Keberanian",
        narrative_cat_id: 3,
      },
      {
        code: "NSC-011",
        sub_category: "Bertanya",
        narrative_cat_id: 3,
      },
      {
        code: "NSC-0012",
        sub_category: "Kemampuan Umum",
        narrative_cat_id: 4,
      },
      {
        code: "NSC-013",
        sub_category: "Keterampilan Belajar",
        narrative_cat_id: 4,
      },
      {
        code: "NSC-014",
        sub_category: "Pengetahuan",
        narrative_cat_id: 5,
      },
      {
        code: "NSC-015",
        sub_category: "Keterampilan",
        narrative_cat_id: 5,
      },
      {
        code: "NSC-016",
        sub_category: "Pengetahuan",
        narrative_cat_id: 6,
      },
      {
        code: "NSC-017",
        sub_category: "Keterampilan",
        narrative_cat_id: 6,
      },
      {
        code: "NSC-018",
        sub_category: "Pengetahuan",
        narrative_cat_id: 7,
      },
      {
        code: "NSC-019",
        sub_category: "Keterampilan",
        narrative_cat_id: 7,
      },
      {
        code: "NSC-020",
        sub_category: "Pengetahuan",
        narrative_cat_id: 8,
      },
      {
        code: "NSC-021",
        sub_category: "Keterampilan",
        narrative_cat_id: 8,
      },
      {
        code: "NSC-022",
        sub_category: "Pengetahuan",
        narrative_cat_id: 9,
      },
      {
        code: "NSC-023",
        sub_category: "Keterampilan",
        narrative_cat_id: 9,
      },
      {
        code: "NSC-024",
        sub_category: "Keberanian untuk Mencoba",
        narrative_cat_id: 10,
      },
      {
        code: "NSC-025",
        sub_category: "Percaya Diri",
        narrative_cat_id: 10,
      },
      {
        code: "NSC-026",
        sub_category: "Tidak Mudah Berkeluh Kesah",
        narrative_cat_id: 10,
      },
      {
        code: "NSC-027",
        sub_category: "Semangat Pantang Menyerah",
        narrative_cat_id: 10,
      },
      {
        code: "NSC-028",
        sub_category: "Motorik",
        narrative_cat_id: 10,
      },
      {
        code: "NSC-029",
        sub_category: "Pengetahuan",
        narrative_cat_id: 11,
      },
      {
        code: "NSC-030",
        sub_category: "Keterampilan",
        narrative_cat_id: 11,
      },
      {
        code: "NSC-031",
        sub_category: "Listening",
        narrative_cat_id: 12,
      },
      {
        code: "NSC-032",
        sub_category: "Pengetahuan",
        narrative_cat_id: 13,
      },
      {
        code: "NSC-033",
        sub_category: "Keterampilan",
        narrative_cat_id: 13,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ref_narrative_sub_categories", null, {});
  },
};
