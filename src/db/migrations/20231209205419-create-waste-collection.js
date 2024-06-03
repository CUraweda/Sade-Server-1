"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_waste_collection", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student_class_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "tbl_students_in_class",
          key: "id",
        },
      },
      day_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_weekday",
          key: "id",
        },
      },
      collection_date: {
        type: Sequelize.DATE,
      },
      waste_type_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "ref_wastetypes",
          key: "id",
        },
      },
      weight: {
        type: Sequelize.DOUBLE,
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
    await queryInterface.dropTable("tbl_waste_collection");
  },
};
