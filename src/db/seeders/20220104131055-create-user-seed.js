const bcrypt = require("bcryptjs");
const uuid = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("ref_users", [
      {
        uuid: uuid.v4(),
        role_id: 1,
        full_name: "John Doe",
        email: "admin@example.com",
        status: 1,
        email_verified: 1,
        password: bcrypt.hashSync("12345678", 8),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ref_users", null, {});
  },
};
