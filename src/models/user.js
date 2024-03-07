const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const UserTypes = require("./UserType");
const Business = require("./Business");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
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
    status: {
      type: DataTypes.INTEGER,
    },
    userTypeId: {
      type: DataTypes.INTEGER,
      comment: '1 = Admin, 2 = Business Admin, 3 = sub Admin/expert, 4 = Customer'
    },
    businessId: {
      type: DataTypes.BIGINT,
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

User.belongsTo(UserTypes, { foreignKey: "userTypeId" });
User.belongsTo(Business, { foreignKey: "businessId", as: "businessInfo" });

module.exports = User;
