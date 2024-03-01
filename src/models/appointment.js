const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./user");
const Business = require("./business");

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointmentDate: {
      type: DataTypes.STRING,
    },
    appointmentTime: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirm", "cancel"),
      defaultValue: "pending",
    },
    businessId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    doctorId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Appointment",
    updatedAt: false,
  }
);

(async () => {
  await Appointment.sync({ force: false });
})();

Appointment.belongsTo(Business, { foreignKey: "businessId", as:"business" });
Appointment.belongsTo(User, { foreignKey: "userId", as: "patientInfo" });
Appointment.belongsTo(User, { foreignKey: "doctorId", as: "doctorInfo" });

module.exports = Appointment;
