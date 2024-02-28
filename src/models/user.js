const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Availability = require("./availability");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    photo: {
      type: DataTypes.STRING,
    },
    specialty: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("patient", "admin", "doctor"),
      defaultValue: "patient",
    },
    availabilityId: {
      type: DataTypes.INTEGER,
    },
    fpToken: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "User",
  }
);

(async () => {
  await User.sync({ force: false });
})();

User.belongsTo(Availability, { foreignKey: "availabilityId" });

module.exports = User;
