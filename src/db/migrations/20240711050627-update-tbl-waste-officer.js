'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add student_id column if it doesn't exist
    const tableDesc = await queryInterface.describeTable('tbl_waste_officer');
    if (!tableDesc.employee_id) {
      await queryInterface.addColumn('tbl_waste_officer', 'employee_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    // Add class_id column if it doesn't exist
    if (!tableDesc.class_id) {
      await queryInterface.addColumn('tbl_waste_officer', 'class_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    // Add foreign key constraint for class_id if not already added
    const constraints = await queryInterface.getForeignKeyReferencesForTable('tbl_waste_officer');
    const classIdConstraintExists = constraints.some(constraint => constraint.columnName === 'class_id' && constraint.referencedTableName === 'ref_classes');
    if (!classIdConstraintExists) {
      await queryInterface.addConstraint('tbl_waste_officer', {
        fields: ['class_id'],
        type: 'foreign key',
        name: 'fk_class_id_ref_classes', // Constraint name should be unique
        references: {
          table: 'ref_classes',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }

    // Add foreign key constraint for student_id
    const employeeIdConstraintExists = constraints.some(constraint => constraint.columnName === 'employee_id' && constraint.referencedTableName === 'tbl_employees');
    if (!employeeIdConstraintExists) {
      await queryInterface.addConstraint('tbl_waste_officer', {
        fields: ['employee_id'],
        type: 'foreign key',
        name: 'fk_student_id_tbl_employees', // Constraint name should be unique
        references: {
          table: 'tbl_students',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraints
    await queryInterface.removeConstraint('tbl_waste_officer', 'fk_student_id_tbl_employees');
    await queryInterface.removeConstraint('tbl_waste_officer', 'fk_class_id_ref_classes');

  }
};
