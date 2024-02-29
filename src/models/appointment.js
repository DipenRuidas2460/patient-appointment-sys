const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Clinic = require("./clinic");
const User = require("./user");

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointment_datetime: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirm", "cancel"),
      defaultValue: "pending",
    },
    clinicId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    doctorId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
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

Appointment.belongsTo(Clinic, { foreignKey: "clinicId", as:"clinicdetails" });
Appointment.belongsTo(User, { foreignKey: "userId", as: "patientInfo" });
Appointment.belongsTo(User, { foreignKey: "doctorId", as: "doctorInfo" });

module.exports = Appointment;
