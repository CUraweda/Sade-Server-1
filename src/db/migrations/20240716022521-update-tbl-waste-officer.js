'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add foreign key constraint for student_id
    const constraints = await queryInterface.getForeignKeyReferencesForTable('tbl_waste_officer');
    const studentIdConstraintExists = constraints.some(constraint => constraint.columnName === 'student_id' && constraint.referencedTableName === 'tbl_students');
    if (!studentIdConstraintExists) {
      await queryInterface.addConstraint('tbl_waste_officer', {
        fields: ['student_id'],
        type: 'foreign key',
        name: 'fk_student_id_tbl_students', // Constraint name should be unique
        references: {
          table: 'tbl_students',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('tbl_waste_officer', 'fk_student_id_tbl_students');
  }
};
