const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Business = require("./Business");

class BusinessTiming extends Model {}

BusinessTiming.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    businessId: {
      type: DataTypes.BIGINT,
    },
    dayName: {
      type: DataTypes.STRING(100),
    },
    openTime: {
      type: DataTypes.TIME,
    },
    closeTime: {
      type: DataTypes.TIME,
    },
    lunchStart: {
      type: DataTypes.TIME,
    },
    lunchEnd: {
      type: DataTypes.TIME,
    },
    slotTime: {
      type: DataTypes.INTEGER,
      comment: "Appointment Slot Time",
    },
    breakTime: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "BusinessTiming",
    timestamps: false,
    sequelize,
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
