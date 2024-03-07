const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Business extends Model {}

Business.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    businessName: {
      type: DataTypes.STRING(255),
    },
    category: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING(255),
    },
    state: {
      type: DataTypes.STRING(255),
    },
    zipCode: {
      type: DataTypes.STRING(55),
    },
    phoneNo: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "Business",
    timestamps: false,
    sequelize,
  }
);

(async () => {
  await Business.sync({ force: false });
})();

module.exports = Business;
