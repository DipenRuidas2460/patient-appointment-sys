const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const UserTypes = sequelize.define(
  "UserTypes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    typeName: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "UserTypes",
    updatedAt: false,
  }
);

(async () => {
  await UserTypes.sync({ force: false });
})();

module.exports = UserTypes;
