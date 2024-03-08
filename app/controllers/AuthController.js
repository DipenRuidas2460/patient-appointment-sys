require("dotenv").config();
const { checkPassword, validateToken } = require("../helpers/main");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expiresIn = "1y";
const secretKey = process.env.APPTOKEN;

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(200)
        .json({
          status: 401,
          message: "Please Provide Username and Password!",
        });
    }

    const user = await User.findOne({ where: { email: username } });

    // Check if User is available with the Username
    if (!user) {
      return res
        .status(200)
        .json({ status: 401, message: "Invalid Username, Please Try Again!" });
    }

    // Check the User Password with Given Password
    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(200)
        .json({
          status: 401,
          message: "Incorrect Password, Please Try Again!",
        });
    }

    const token = jwt.sign(
      { id: user.id, userType: user.userType, businessId: user.businessId },
      secretKey,
      { expiresIn: expiresIn }
    );

    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      businessId: user.businessId,
      phone: user.phone,
      userType: user.userType,
      status: user.status,
    };

    res.status(200).json({
      status: 200,
      token: token,
      userdata: data,
      message: "User Login Successfully",
    });
  } catch (error) {
    return res.status(200).json({ status: 500, message: error.message });
  }
};

const ping = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(200).json({
        status: 401,
        message: "Invalid Authentication",
      });
    }

    const user = await validateToken(req.headers.authorization);

    await User.findByPk(user.id, {
      attributes: [
        "id",
        "name",
        "email",
        "businessId",
        "phone",
        "userType",
        "status",
      ],
    })
      .then((userData) => {
        return res.status(200).json({ status: 200, data: userData });
      })
      .catch(() => {
        return res
          .status(200)
          .json({ status: 500, message: "Some Error Occured" });
      });
  } catch (error) {
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = {
  loginUser,
  ping,
};
