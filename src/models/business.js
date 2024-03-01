const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Business = sequelize.define(
  "Business",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    businessName: {
      type: DataTypes.STRING,
    },
    businessCategory: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "Business",
    updatedAt: false,
  }
);

(async () => {
  await Business.sync({ force: false });
})();

module.exports = Business;
