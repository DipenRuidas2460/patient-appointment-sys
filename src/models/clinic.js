const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./user");

const Clinic = sequelize.define(
  "Clinic",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clinicName: {
      type: DataTypes.STRING(),
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
    businessDetails: {
      type: DataTypes.STRING,

    },
    doctorId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Clinic",
    updatedAt: false,
  }
);

(async () => {
  await Clinic.sync({ force: false });
})();

Clinic.belongsTo(User, { foreignKey: "doctorId", as: "doctordetails" });

module.exports = Clinic;
