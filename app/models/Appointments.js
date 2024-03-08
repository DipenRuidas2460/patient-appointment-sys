const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Business = require("./Business");
const User = require("./User");

class Appointments extends Model {}

Appointments.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    businessId: {
      type: DataTypes.BIGINT,
    },
    customerId: {
      type: DataTypes.BIGINT,
    },
    expertId: {
      type: DataTypes.BIGINT,
    },
    date: {
      type: DataTypes.DATE,
    },
    slot: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.INTEGER,
      comment:
        "1 = recent not confirm appointment , 2 == confirm - today's appointment, 3 = join - checkIn",
    },
    createAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "xcd_appointment",
    timestamps: false,
    sequelize,
  }
);

Appointments.belongsTo(User, { foreignKey: "customerId", as: "customers" });
Appointments.belongsTo(User, { foreignKey: "expertId", as: "experts" });
Appointments.belongsTo(Business, { foreignKey: "businessId", as: "business" });

module.exports = Appointments;
