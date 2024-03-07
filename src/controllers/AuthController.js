const asyncHandler = require("express-async-handler");
const { join } = require("path");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const {
  checkPassword,
  encryptPassword,
  generateString,
} = require("../helper/side");
const moment = require("moment");
const { sendMail } = require("../helper/sendMail");
const User = require("../models/User");

const secretKey = process.env.TOKEN_secret_key;
const expiresIn = "24h";

const addUser = asyncHandler(async (req, res) => {
  try {
    const { name, phone, email, password, userTypeId, status, businessId } =
      req.body;

    let profilePhoto = null;
    const randomInRange = Math.floor(Math.random() * 10) + 1;
    if (req?.files?.photo) {
      profilePhoto = req.files.photo;
      const imagePath = join(
        __dirname,
        "../uploads/profileImage/",
        `${randomInRange}_profile_photo`
      );
      await profilePhoto.mv(imagePath);
    }
    const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD, HH:mm");

    if (email != "" || phone != "") {
      const findEmail = await User.findOne({
        where: { email: email },
      });

      const findPhoneNumber = await User.findOne({
        where: { phone: phone },
      });

      if (findEmail) {
        return res
          .status(200)
          .json({ status: 409, msg: "Email is already present!" });
      }

      if (findPhoneNumber) {
        return res.status(200).json({
          status: 409,
          msg: "Phone Number is already present!",
        });
      }
    }

    const passwrd = await encryptPassword(password);

    const newReqData = {
      name,
      email,
      password: passwrd,
      phone,
      photo: profilePhoto ? `${randomInRange}_profile_photo` : null,
      userTypeId,
      businessId,
      status,
      createdTime: currentDate,
    };

    await User.create(newReqData)
      .then(async (userDetails) => {
        const token = sign(
          {
            id: userDetails.id,
            userTypeId: userDetails.userTypeId,
            businessId: userDetails.businessId,
          },
          secretKey,
          { expiresIn }
        );

        const mailData = {
          respMail: email,
          subject: "Welcome",
          text: `Hi, ${name}. Welcome to Patient Appointment Management App.`,
        };
        await sendMail(mailData);

        if (userDetails) {
          const {
            id,
            name,
            email,
            phone,
            userTypeId,
            businessId,
            status,
            createdTime,
            photo,
          } = userDetails;

          const registerUserData = {
            id,
            name,
            email,
            phone,
            userTypeId,
            businessId,
            status,
            photo: photo ? photo : null,
            token,
            createdTime,
          };

          res.header("Authorization", `Bearer ${token}`);

          return res.status(201).json({
            status: 200,
            data: registerUserData,
            message: "User successfully created!",
          });
        } else {
          return res
            .status(200)
            .json({ status: 400, message: "User is not created!" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(200)
          .json({ status: 400, message: "An Error Occured!" });
      });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({
        status: 400,
        message: "Send valid email and Password",
      });
    }

    await User.findOne({ where: { email: email } })
      .then(async (userDetails) => {
        if (!userDetails) {
          return res
            .status(200)
            .json({ status: 400, message: "email incorrect" });
        }

        const isPassMatch = await checkPassword(password, userDetails.password);

        if (!isPassMatch) {
          return res
            .status(200)
            .json({ status: 400, message: "Incorrect password, try again" });
        }

        const token = sign(
          {
            id: userDetails.id,
            userTypeId: userDetails.userTypeId,
            businessId: userDetails.businessId,
          },
          secretKey,
          { expiresIn }
        );
        const data = {
          id: userDetails.id,
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          photo: userDetails.photo ? userDetails.photo : null,
          specialty: userDetails.specialty ? userDetails.specialty : null,
          userTypeId: userDetails.userTypeId,
          businessId: userDetails.businessId,
          status: userDetails.status,
        };

        res.header("Authorization", `Bearer ${token}`);

        return res.status(200).json({
          status: 200,
          userdata: data,
          token: token,
          message: "Login successfull",
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(200)
          .json({ status: 400, message: "An Error Occured!" });
      });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      status: 500,
      data: error.message,
      message: "Internal Server Error",
    });
  }
});

const forgetPass = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const userDetails = await User.findOne({
      where: { email: email },
    });
    if (!userDetails) {
      return res.status(200).json({ status: 404, message: "No user found" });
    }

    const token = generateString(20);
    await User.update({ fpToken: token }, { where: { email: email } });

    const mailData = {
      respMail: email,
      subject: "Forget Password",
      text: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="styles.css" />
      <title>Static Template</title>
    </head>
    <body>
      <h3>Click this link for changing Password</h3>
      <p>${process.env.FRN_HOST}/resetpass/${token}</p>
    </body>
  </html>
  `,
    };
    await sendMail(mailData);

    return res.status(200).json({
      status: 200,
      token: token,
      message: "Check your email for reset link",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
});

const fpUpdatePass = asyncHandler(async (req, res) => {
  try {
    let reqBody = req.body;

    const { token } = req.body;

    const userInfo = await User.findOne({ where: { fpToken: token } });
    if (!userInfo)
      return res
        .status(200)
        .json({ status: 400, message: "Wrong link or link expired!" });

    if (reqBody.password) {
      reqBody.password = await encryptPassword(reqBody.password);
    }

    const response = await User.update(
      { password: reqBody.password },
      {
        where: { fpToken: token },
      }
    );

    return res.status(201).json({
      status: response[0] === 0 ? 404 : 200,
      data: response,
      message:
        response[0] === 0
          ? "Nothing updated"
          : "User Password changed successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
});

module.exports = {
  addUser,
  login,
  forgetPass,
  fpUpdatePass,
};
