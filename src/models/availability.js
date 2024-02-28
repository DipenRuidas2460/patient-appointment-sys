const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

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
  },
  {
    tableName: "Availability",
    updatedAt: false,
  }
);

(async () => {
  await Availability.sync({ force: false });
})();

module.exports = Availability;