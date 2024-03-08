const { Sequelize } = require("sequelize");
require("dotenv").config();


const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: 3306,
  logging: false,
  dialectOptions: {
    connectTimeout: 60000, // Set the connection timeout to 60 seconds
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Datebase Connected Successfully.");
    (async () => {
      await sequelize.sync();
    })();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};



connectToDatabase();

module.exports = sequelize;
