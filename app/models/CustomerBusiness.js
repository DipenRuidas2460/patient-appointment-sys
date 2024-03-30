const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Business = require("./Business");
const User = require("./User");

class CustomerBusiness extends Model {}

CustomerBusiness.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.BIGINT,
    },
    businessId: {
      type: DataTypes.BIGINT,
    },
  },
  {
    tableName: "xcd_customer_business",
    timestamps: false,
    sequelize,
  }
);

Business.hasMany(User, { foreignKey: "businessId", as: "customer" });
User.belongsTo(Business, { foreignKey: "businessId", as: "customer" });

module.exports = CustomerBusiness;
