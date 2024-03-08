const bcrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.APPTOKEN;
const jwt = require("jsonwebtoken");

// Function to encrypt a password
const encryptPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to compare a password with its encrypted version
const checkPassword = async (inputPassword, encryptedPassword) => {
  const passwordMatch = await bcrypt.compare(inputPassword, encryptedPassword);
  return passwordMatch;
};

// For Validating User from Token
const validateToken = (token) => {
  try {
    if (!token) {
      return false;
    }

    token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken;
  } catch (error) {
    return false;
  }
};

const getDayName = (_date) => {
  const weekDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(_date);
  const dayIndex = date.getDay();
  return weekDay[dayIndex];
};

module.exports = {
  encryptPassword,
  checkPassword,
  validateToken,
  getDayName,
};
