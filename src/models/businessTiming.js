const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Business = require("./business");

const BusinessTiming = sequelize.define(
  "BusinessTiming",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dayName: {
      type: DataTypes.STRING,
    },
    openingTime: {
      type: DataTypes.TIME,
    },
    closingTime: {
      type: DataTypes.TIME,
    },
    lunchTimeStart: {
      type: DataTypes.TIME,
    },
    lunchTimeEnd: {
      type: DataTypes.TIME,
    },
    breakTimeInMinutes: {
      type: DataTypes.INTEGER,
    },
    sessionTimeInMinutes: {
      type: DataTypes.INTEGER,
    },
    noOfSession: {
      type: DataTypes.INTEGER,
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    businessId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "BusinessTiming",
    updatedAt: false,
  }
);

(async () => {
  await BusinessTiming.sync({ force: false });
})();

BusinessTiming.belongsTo(Business, {
  foreignKey: "businessId",
  as: "business",
});

module.exports = BusinessTiming;
