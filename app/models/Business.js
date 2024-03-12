const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const BusinessTiming = require("./BusinessTiming");

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
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "xcd_business",
    timestamps: false,
    sequelize,
  }
);

Business.hasMany(BusinessTiming, { foreignKey: "businessId", as: "businessTiming" });

module.exports = Business;
