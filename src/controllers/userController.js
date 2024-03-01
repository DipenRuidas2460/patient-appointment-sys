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
const User = require("../models/user");
const UserTypes = require("../models/userType");

const secretKey = process.env.TOKEN_secret_key;
const expiresIn = "24h";

const addUser = asyncHandler(async (req, res) => {
  try {
    const { name, phone, email, password, roleId, specialty, status } =
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
          .status(409)
          .json({ status: "email conflict", msg: "Email is already present!" });
      }

      if (findPhoneNumber) {
        return res.status(409).json({
          status: "phone conflict",
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
      roleId,
      businessId,
      specialty,
      status,
      createdTime: currentDate,
    };

    const userDetails = await User.create(newReqData);
    const response = await userDetails.save();

    const token = sign(
      { id: userDetails.id, roleId: userDetails.roleId },
      secretKey,
      { expiresIn }
    );

    const mailData = {
      respMail: email,
      subject: "Welcome",
      text: `Hi, ${name}. Welcome to Patient Appointment Management App.`,
    };
    await sendMail(mailData);

    if (response) {
      const {
        id,
        name,
        email,
        phone,
        roleId,
        businessId,
        status,
        createdTime,
        photo,
        specialty,
      } = response;

      const registerUserData = {
        id,
        name,
        email,
        phone,
        roleId,
        businessId,
        status,
        photo: photo ? photo : null,
        specialty: specialty ? specialty : null,
        token,
        createdTime,
      };

      res.header("Authorization", `Bearer ${token}`);

      return res.status(201).json({
        status: true,
        userData: registerUserData,
        message: "User successfully created!",
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "User is not created!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "error",
        message: "Send valid email and Password",
      });
    }

    const userDetails = await User.findOne({ where: { email: email } });

    if (!userDetails) {
      return res
        .status(401)
        .json({ status: "error", message: "email incorrect" });
    }

    const isPassMatch = await checkPassword(password, userDetails.password);

    if (!isPassMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect password, try again" });
    }

    const token = sign(
      { id: userDetails.id, roleId: userDetails.roleId },
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
      roleId: userDetails.roleId,
      businessId: userDetails.businessId,
      status: userDetails.status,
    };

    res.header("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      status: "success",
      userdata: data,
      token: token,
      message: "Login successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, data: error.message, message: "Login fail" });
  }
});

const logOut = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json({
      status: true,
      msg: "Successfully Logged Out!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, data: error.message, message: "LogOut Failed!" });
  }
});

const forgetPass = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const userDetails = await User.findOne({
      where: { email: email },
    });
    if (!userDetails) {
      return res.status(404).json({ status: false, message: "No user found" });
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
      status: "success",
      token: token,
      message: "Check your email for reset link",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const fpUpdatePass = asyncHandler(async (req, res) => {
  try {
    let reqBody = req.body;

    const { token } = req.body;

    const userInfo = await User.findOne({ where: { fpToken: token } });
    if (!userInfo)
      return res
        .status(400)
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
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    let reqBody = req.body;
    const userData = await User.findOne({ where: { id: req.person.id } });

    let updatedImage = null;
    const randomInRange = Math.floor(Math.random() * 10) + 1;
    const updatedPhotoName = `${randomInRange}_profile_photo`;
    if (req?.files?.photo) {
      updatedImage = req.files.photo;
      const imagePath = join(
        __dirname,
        "../uploads/profileImage/",
        `${userData.photo ? userData.photo : updatedPhotoName}`
      );
      await updatedImage.mv(imagePath);
    }

    if (reqBody.password) {
      reqBody.password = await encryptPassword(reqBody.password);
    }

    if (updatedImage) {
      reqBody.photo = userData.photo ? userData.photo : updatedPhotoName;
    }

    const response = await User.update(reqBody, {
      where: { id: req.person.id },
    });

    return res.status(200).json({
      status: response[0] === 0 ? 404 : 200,
      data: response,
      message: response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  try {
    let reqBody = req.body;
    let userId = req.params.userId;
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.roleId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const userData = await User.findOne({ where: { id: userId } });

      let updatedImage = null;
      const randomInRange = Math.floor(Math.random() * 10) + 1;
      const updatedPhotoName = `${randomInRange}_profile_photo`;
      if (req?.files?.photo) {
        updatedImage = req.files.photo;
        const imagePath = join(
          __dirname,
          "../uploads/profileImage/",
          `${userData.photo ? userData.photo : updatedPhotoName}`
        );
        await updatedImage.mv(imagePath);
      }

      if (reqBody.password) {
        reqBody.password = await encryptPassword(reqBody.password);
      }

      if (updatedImage) {
        reqBody.photo = userData.photo ? userData.photo : updatedPhotoName;
      }

      const response = await User.update(reqBody, {
        where: { id: userId },
      });

      return res.status(201).json({
        status: response[0] === 0 ? 404 : 200,
        data: response,
        message:
          response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
      });
    } else {
      return res.status(403).json({ message: "Only Admin Can edit!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const response = await User.findOne({
      where: { id: req.person.id },
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "roleId",
        "businessId",
        "status",
        "photo",
        "specialty",
      ],
    });

    return res.status(200).json({
      status: "success",
      data: response,
      profileImage: response.photo ? `/assets/image/${response.photo}` : null,
      message: response ? "Successfully fetch data" : "User Not Present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const getUserByAdminThroughId = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.roleId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const response = await User.findOne({
        where: { id: req.params.userId },
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "roleId",
          "businessId",
          "status",
          "photo",
          "specialty",
        ],
      });

      return res.status(200).json({
        status: "success",
        data: response,
        profileImage: response.photo ? `/assets/image/${response.photo}` : null,
        message: response ? "Successfully fetch data" : "User Not Present!",
      });
    } else {
      return res.status(403).json({ message: "Only Admin Can access!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const response = await User.findOne({ where: { id: req.person.id } });

    const { oldPassword, password } = req.body;

    if (!response) {
      return res.status(404).json({
        status: false,
        message: "User not Found, Please Register first!",
      });
    }

    if (!oldPassword || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please add Old and new password!" });
    }

    const isPassMatch = await checkPassword(
      oldPassword.trim(),
      response.password
    );

    if (response && isPassMatch) {
      response.password = password;
      await response.save();
      return res.status(200).send({
        status: true,
        data: response,
        message: "password changed successfully!",
      });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "oldPassword is incorrect!!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const response = await User.findAll({});
    return res.status(200).json({
      status: "success",
      data: response,
      message: response.length ? "Successfully fetch data" : "No data found",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
      messageInfo: error,
    });
  }
});

const deleteUserByAdminThroughId = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.roleId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const userData = await User.findOne({ where: { id: req.params.userId } });
      if (userData) {
        await User.destroy({
          where: { id: req.params.userId },
        });

        return res.status(200).json({
          status: "success",
          message: "User data delete successfully!",
        });
      } else {
        return res.status(404).json({ message: "User data not found!" });
      }
    } else {
      return res.status(403).json({ message: "Only Admin Can access!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

module.exports = {
  login,
  addUser,
  forgetPass,
  fpUpdatePass,
  logOut,
  updateUser,
  getUserById,
  updatePassword,
  getAllUsers,
  updateUserByAdmin,
  getUserByAdminThroughId,
  deleteUserByAdminThroughId,
};
