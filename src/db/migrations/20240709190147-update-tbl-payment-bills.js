'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_payment_bills', 'level');
    await queryInterface.removeColumn('tbl_payment_bills', 'class_id');
    await queryInterface.removeColumn('tbl_payment_bills', 'student_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_payment_bills', 'level', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('tbl_payment_bills', 'class_id', {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'ref_classes',
      },
    });
    await queryInterface.addColumn('tbl_payment_bills', 'student_id', {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'tbl_students',
      },
    });
  }
};

