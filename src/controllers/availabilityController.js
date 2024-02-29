const asyncHandler = require("express-async-handler");
const Availability = require("../models/availability");
const User = require("../models/user");

const createAvailability = asyncHandler(async (req, res) => {
  try {
    if (req.person.role !== "patient") {
      const availabilityData = await Availability.create(req.body);
      const response = await availabilityData.save();

      return res.status(201).json({
        status: true,
        response,
        message: "Availablity data created successfully!",
      });
    } else {
      return res
        .status(403)
        .json({ message: "Only Admin and Doctor Can Created!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const fetchAvailability = asyncHandler(async (req, res) => {
  try {
    const response = await Availability.findAll(
      {},
      {
        include: [
          {
            model: User,
            as: "doctor",
            attributes: {
              exclude: ["password", "fpToken", "createdAt"],
            },
          },
        ],
      }
    );
    return res.status(200).json({
      status: "success",
      data: response,
      message:
        response.length > 0
          ? "Successfully fetch data"
          : "Availability data not present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const fetchAvailabilityById = asyncHandler(async (req, res) => {
  try {
    const response = await Availability.findOne(
      {
        where: { id: req.params.availableId },
      },
      {
        include: [
          {
            model: User,
            as: "doctor",
            attributes: {
              exclude: ["password", "fpToken", "updatedAt", "createdAt"],
            },
          },
        ],
      }
    );
    return res.status(200).json({
      status: "success",
      data: response,
      message: response
        ? "Successfully fetch data"
        : "Availability data not present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const fetchAvailabilityByDoctorId = asyncHandler(async (req, res) => {
  try {
    const response = await Availability.findOne(
      {
        where: { doctorId: req.params.doctorId },
      },
      {
        include: [
          {
            model: User,
            as: "doctor",
            attributes: {
              exclude: ["password", "fpToken", "updatedAt", "createdAt"],
            },
          },
        ],
      }
    );
    return res.status(200).json({
      status: "success",
      data: response,
      message: response
        ? "Successfully fetch data"
        : "Availability data not present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const updateAvailability = asyncHandler(async (req, res) => {
  try {
    if (req.person.role !== "patient") {
      const response = await Availability.update(req.body, {
        where: { id: req.params.availableId },
      });
      return res.status(200).json({
        status: response[0] === 0 ? 404 : 200,
        data: response,
        message:
          response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
      });
    } else {
      return res
        .status(403)
        .json({ message: "Only Admin and Doctor Can Edit!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const deleteAvailabilityByAdmin = asyncHandler(async (req, res) => {
  try {
    if (req.person.role === "admin") {
      const availabilityData = await Availability.findOne({
        where: { id: req.params.availableId },
      });
      if (availabilityData) {
        await Availability.destroy({
          where: { id: req.params.availableId },
        });
        return res.status(200).json({
          message: "Availability data deleted Successfully!",
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
  createAvailability,
  fetchAvailability,
  fetchAvailabilityById,
  updateAvailability,
  deleteAvailabilityByAdmin,
  fetchAvailabilityByDoctorId
};
