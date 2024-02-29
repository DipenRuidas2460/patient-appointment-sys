const asyncHandler = require("express-async-handler");
const Clinic = require("../models/clinic");
const User = require("../models/user");

const createClinicData = asyncHandler(async (req, res) => {
  try {
    if (req.person.role === "admin") {
      const clinicData = await Clinic.create(req.body);
      const response = await clinicData.save();

      return res.status(201).json({
        status: true,
        response,
        message: "clinic data created successfully!",
      });
    } else {
      return res.status(403).json({ message: "Only Admin Can Created!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const fetchAllClinic = asyncHandler(async (req, res) => {
  try {
    const response = await Clinic.findAll(
      {},
      {
        include: [
          {
            model: User,
            as: "doctordetails",
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
        response.length > 0 ? "Successfully fetch data" : "Data not present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const fetchClinicById = asyncHandler(async (req, res) => {
  try {
    const response = await Clinic.findOne(
      {
        where: { id: req.params.clinicId },
      },
      {
        include: [
          {
            model: User,
            as: "doctordetails",
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
      message: response ? "Successfully fetch data" : "Data not present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const fetchClinicDoctorId = asyncHandler(async (req, res) => {
  try {
    const response = await Clinic.findOne(
      {
        where: { doctorId: req.params.doctorId },
      },
      {
        include: [
          {
            model: User,
            as: "doctordetails",
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
      message: response ? "Successfully fetch data" : "Data not present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const updateClinicByAdmin = asyncHandler(async (req, res) => {
  try {
    if (req.person.role === "admin") {
      const response = await Clinic.update(req.body, {
        where: { id: req.params.clinicId },
      });
      return res.status(200).json({
        status: response[0] === 0 ? 404 : 200,
        data: response,
        message:
          response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
      });
    } else {
      return res.status(403).json({ message: "Only Admin Can Edit!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const deleteClinicByAdmin = asyncHandler(async (req, res) => {
  try {
    if (req.person.role === "admin") {
      const response = await Clinic.findOne({
        where: { id: req.params.clinicId },
      });
      if (response) {
        await Clinic.destroy({
          where: { id: req.params.clinicId },
        });
        return res.status(200).json({
          message: "Clinic data deleted Successfully!",
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
  createClinicData,
  fetchAllClinic,
  fetchClinicById,
  updateClinicByAdmin,
  deleteClinicByAdmin,
  fetchClinicDoctorId
};
