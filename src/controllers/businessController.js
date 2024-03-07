const asyncHandler = require("express-async-handler");
const Business = require("../models/Business");

const createBusiness = asyncHandler(async (req, res) => {
  try {
    if (req.person.userTypeId === 1 || req.person.userTypeId === 2) {
      const response = await Business.create(req.body);
      return res.status(201).json({
        status: 200,
        response,
        message: "Business data created successfully!",
      });
    } else {
      return res
        .status(200)
        .json({ status: 403, message: "Only Admin Can Add Business!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
});

const fetchAllBusiness = asyncHandler(async (req, res) => {
  try {
    const response = await Business.findAll({});
    return res.status(200).json({
      status: "success",
      response,
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

const fetchBusinessById = asyncHandler(async (req, res) => {
  try {
    const response = await Business.findOne({
      where: { id: req.params.businessId },
    });
    return res.status(200).json({
      status: "success",
      response,
      message: response ? "Successfully fetch data" : "Data not present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const updateBusinessByAdmin = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.userTypeId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const response = await Business.update(req.body, {
        where: { id: req.params.businessId },
      });
      return res.status(200).json({
        status: response[0] === 0 ? 404 : 200,
        data: response,
        message:
          response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
      });
    } else {
      return res
        .status(200)
        .json({ status: 403, message: "Only Admin Can Edit!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const deleteBusinessByAdmin = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.userTypeId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const response = await Business.findOne({
        where: { id: req.params.businessId },
      });
      if (response) {
        await Business.destroy({
          where: { id: req.params.businessId },
        });
        return res.status(200).json({
          message: "Business data deleted Successfully!",
        });
      } else {
        return res.status(404).json({ message: "Data not found!" });
      }
    } else {
      return res.status(403).json({ message: "Only Admin Can Delete!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

module.exports = {
  createBusiness,
  fetchAllBusiness,
  fetchBusinessById,
  updateBusinessByAdmin,
  deleteBusinessByAdmin,
};
