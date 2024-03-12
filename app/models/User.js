const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Business = require("./Business");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    guiId: {
      type: DataTypes.STRING(55),
    },
    name: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING(255),
    },
    zipCode: {
      type: DataTypes.STRING(55),
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    password: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.STRING(55),
    },
    photo: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.INTEGER,
    },
    userType: {
      type: DataTypes.INTEGER,
      comment:
        "1 = Admin, 2 = Business Admin, 3 = sub Admin/expert, 4 = Customer",
    },
    businessId: {
      type: DataTypes.BIGINT,
    },
    fpToken: {
      type: DataTypes.STRING(255),
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "xcd_user",
    timestamps: false,
    sequelize,
  }
);

User.belongsTo(Business, { foreignKey: "businessId", as: "business" });

module.exports = User;
