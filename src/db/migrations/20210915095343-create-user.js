module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ref_users", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        unique: true,
        type: Sequelize.INTEGER,
        references: {
          model: "tbl_employees",
          key: "id"
        }
      },
      signature_path: {
        type: Sequelize.INTEGER,
        
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ref_users");
  },
};
