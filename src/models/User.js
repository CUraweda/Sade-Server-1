const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.roles, { foreignKey: "role_id" });
      User.hasMany(models.useraccess, { foreignKey: "user_id" });
      User.hasMany(models.userchat, { as: "idUser", foreignKey: "user_id" });
      User.hasMany(models.userchat, { as: "withUser", foreignKey: "with_id" });
      User.hasMany(models.messages, { foreignKey: "sender_id" });
      User.hasMany(models.notifications, { foreignKey: "user_id" });
      User.hasOne(models.employees, { foreignKey: "user_id" });
    }
  }

  User.init(
    {
      uuid: DataTypes.UUID,
      role_id: DataTypes.INTEGER,
      full_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.INTEGER,
      email_verified: DataTypes.INTEGER,
      address: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      avatar: DataTypes.STRING,
      reset_token: DataTypes.STRING,
      reset_token_exp: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "ref_users",
      modelName: "user",
      underscored: true,
    }
  );
  return User;
};
