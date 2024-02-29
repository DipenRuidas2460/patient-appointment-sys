const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

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
    fpToken: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "User",
    updatedAt: false,
  }
);

(async () => {
  await User.sync({ force: false });
})();

module.exports = User;
