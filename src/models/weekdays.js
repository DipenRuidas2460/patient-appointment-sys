const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Clinic = require("./clinic");

const WeekDays = sequelize.define(
  "WeekDays",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dayName: {
      type: DataTypes.STRING,
    },
    clinicOpeningTime: {
      type: DataTypes.STRING,
    },
    clinicClosingTime: {
      type: DataTypes.STRING,
    },
    lunchTimeStart: {
      type: DataTypes.STRING,
    },
    lunchTimeEnd: {
      type: DataTypes.STRING,
    },
    sessionTiming: {
      type: DataTypes.STRING,
    },
    sessionBreakStart: {
      type: DataTypes.STRING,
    },
    sessionBreakEnd: {
      type: DataTypes.STRING,
    },
    noOfSession: {
      type: DataTypes.INTEGER,
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    clinicId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "WeekDays",
    updatedAt: false,
  }
);

(async () => {
  await WeekDays.sync({ force: false });
})();

WeekDays.belongsTo(Clinic, { foreignKey: "clinicId", as: "clinic" });

module.exports = WeekDays;
