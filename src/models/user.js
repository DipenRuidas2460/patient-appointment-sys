const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const UserTypes = require("./userType");
const Business = require("./business");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    photo: {
      type: DataTypes.STRING,
    },
    specialty: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    roleId: {
      type: DataTypes.INTEGER,
    },
    businessId: {
      type: DataTypes.INTEGER,
    },
    fpToken: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "User",
    updatedAt: false,
  }
);

(async () => {
  await User.sync({ force: false });
})();

User.belongsTo(UserTypes, { foreignKey: "roleId" });
User.belongsTo(Business, { foreignKey: "businessId" });

module.exports = User;
