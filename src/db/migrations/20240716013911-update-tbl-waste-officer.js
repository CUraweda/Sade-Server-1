'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Check if `employee_id` column exists
    const tableInfo = await queryInterface.describeTable('tbl_waste_officer');
    const employeeIdExists = tableInfo.hasOwnProperty('employee_id');

    // Step 2: Drop `employee_id` column if it exists
    if (employeeIdExists) {
      await queryInterface.removeColumn('tbl_waste_officer', 'employee_id');
    }

    // Step 3: Check if `student_id` column exists
    const studentIdColumn = tableInfo['student_id'];
    const studentIdColumnExists = studentIdColumn !== undefined && studentIdColumn !== null;

    // Step 4: Add `student_id` column if it does not exist
    if (!studentIdColumnExists) {
      await queryInterface.addColumn('tbl_waste_officer', 'student_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Revert dropping `employee_id` column (if you want to roll back)
    await queryInterface.addColumn('tbl_waste_officer', 'employee_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Step 2: Revert dropping or altering `student_id` column and its constraint
    await queryInterface.removeColumn('tbl_waste_officer', 'student_id');
  }
};
