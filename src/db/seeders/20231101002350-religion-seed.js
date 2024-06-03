"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ref_religions", [
      {
        code: "ISL",
        name: "Islam",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "KRI",
        name: "Kristen",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "PRO",
        name: "Protestan",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "HIN",
        name: "Hindu",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "BUD",
        name: "Buddha",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ref_religion", null, {});
  },
};
