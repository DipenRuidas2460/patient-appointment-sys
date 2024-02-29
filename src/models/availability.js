const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./user");

const Availability = sequelize.define(
  "Availability",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startTiming: {
      type: DataTypes.STRING,
    },
    availableDays: {
      type: DataTypes.JSON,
    },
    sessionTiming: {
      type: DataTypes.STRING,
    },
    doctorId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Availability",
    updatedAt: false,
  }
);

(async () => {
  await Availability.sync({ force: false });
})();

Availability.belongsTo(User, { foreignKey: "doctorId", as: "doctor" });

module.exports = Availability;
