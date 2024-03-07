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
    userId: {
      type: DataTypes.BIGINT,
    },
    expertId: {
      type: DataTypes.BIGINT,
    },
    slot: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "Appointments",
    timestamps: false,
    sequelize,
  }
);

(async () => {
  await Appointments.sync({ force: false });
})();

Appointments.belongsTo(User, { foreignKey: "userId", as: "users" });
Appointments.belongsTo(User, { foreignKey: "expertId", as: "experts" });
Appointments.belongsTo(Business, { foreignKey: "businessId", as: "business" });

module.exports = Appointments;
