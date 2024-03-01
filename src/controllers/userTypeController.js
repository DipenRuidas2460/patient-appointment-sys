const asyncHandler = require("express-async-handler");
const UserTypes = require("../models/userType");

const createUserTypes = asyncHandler(async (req, res) => {
  try {
    const response = await UserTypes.create(req.body);

    return res.status(201).json({
      status: true,
      response,
      message: "UserTypes data created successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const fetchAllUserTypes = asyncHandler(async (req, res) => {
  try {
    const response = await UserTypes.findAll({});
    return res.status(200).json({
      status: "success",
      data: response,
      message:
        response.length > 0 ? "Successfully fetch data" : "Data not present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const updateUserTypes = asyncHandler(async (req, res) => {
  try {
    const response = await UserTypes.update(req.body, {
      where: { id: req.params.userTypeId },
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
      .json({ status: false, message: "Something went wrong" });
  }
});

const deleteUserTypes = asyncHandler(async (req, res) => {
  try {
    const response = await UserTypes.findOne({
      where: { id: req.params.userTypeId },
    });
    if (response) {
      await UserTypes.destroy({
        where: { id: req.params.userTypeId },
      });
      return res.status(200).json({
        message: "UserTypes data deleted Successfully!",
      });
    } else {
      return res.status(404).json({ message: "Data not found!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

module.exports = {
  createUserTypes,
  fetchAllUserTypes,
  updateUserTypes,
  deleteUserTypes
};
