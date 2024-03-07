const asyncHandler = require("express-async-handler");
const UserTypes = require("../models/UserType");
const Appointment = require("../models/appointment");
const User = require("../models/User");
const Business = require("../models/Business");

const createAppointment = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.userTypeId,
      },
    });
    if (
      userTypesData &&
      (userTypesData?.typeName === "patient" ||
        userTypesData?.typeName === "admin")
    ) {
      const reqBody = req.body;
      reqBody.userId = req.person.id;
      const response = await Appointment.create(reqBody);

      return res.status(201).json({
        status: true,
        response,
        message: "Appointment created successfully!",
      });
    } else {
      return res
        .status(403)
        .json({ message: "Only Admin and Patient Can Created!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const fetchAllAppointment = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.userTypeId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const response = await Appointment.findAll(
        {},
        {
          include: [
            {
              model: Business,
              as: "business",
              attributes: {
                exclude: ["createdAt"],
              },
            },
            {
              model: User,
              as: "patientInfo",
              attributes: {
                exclude: ["createdAt", "password", "fpToken", "specialty"],
              },
            },
            {
              model: User,
              as: "doctorInfo",
              attributes: {
                exclude: ["createdAt", "password", "fpToken"],
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
    } else {
      return res
        .status(403)
        .json({ message: "Only Admin Can Access all data!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const fetchAppointmentByAppointmentId = asyncHandler(async (req, res) => {
  try {
    const response = await Appointment.findOne({
      where: { id: req.params.appointmentId },
      include: [
        {
          model: Business,
          as: "business",
          attributes: {
            exclude: ["createdAt"],
          },
        },
        {
          model: User,
          as: "patientInfo",
          attributes: {
            exclude: ["createdAt", "password", "fpToken", "specialty"],
          },
        },
        {
          model: User,
          as: "doctorInfo",
          attributes: {
            exclude: ["createdAt", "password", "fpToken"],
          },
        },
      ],
    });
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

const fetchAllAppointmentByUserIdOrDoctorId = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.userTypeId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "patient") {
      const response = await Appointment.findAll({
        where: { userId: req.person.id },

        include: [
          {
            model: Business,
            as: "business",
            attributes: {
              exclude: ["createdAt"],
            },
          },
          {
            model: User,
            as: "patientInfo",
            attributes: {
              exclude: ["createdAt", "password", "fpToken", "specialty"],
            },
          },
          {
            model: User,
            as: "doctorInfo",
            attributes: {
              exclude: ["createdAt", "password", "fpToken"],
            },
          },
        ],
      });
      return res.status(200).json({
        status: "success",
        data: response,
        message:
          response.length > 0 ? "Successfully fetch data" : "Data not present!",
      });
    } else if (userTypesData && userTypesData?.typeName === "doctor") {
      const response = await Appointment.findAll({
        where: { doctorId: req.person.id },

        include: [
          {
            model: Business,
            as: "business",
            attributes: {
              exclude: ["createdAt"],
            },
          },
          {
            model: User,
            as: "patientInfo",
            attributes: {
              exclude: ["createdAt", "password", "fpToken", "specialty"],
            },
          },
          {
            model: User,
            as: "doctorInfo",
            attributes: {
              exclude: ["createdAt", "password", "fpToken"],
            },
          },
        ],
      });
      return res.status(200).json({
        status: "success",
        data: response,
        message:
          response.length > 0 ? "Successfully fetch data" : "Data not present!",
      });
    } else {
      return res
        .status(403)
        .json({ message: "Only Patient or Doctor Can Access all data!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const updateAppointmentByAppointmentId = asyncHandler(async (req, res) => {
  try {
    const reqBody = req.body;
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.userTypeId,
      },
    });

    if (userTypesData && userTypesData?.typeName === "admin") {
      const response = await Appointment.update(reqBody, {
        where: { id: req.params.appointmentId },
      });
      return res.status(200).json({
        status: response[0] === 0 ? 404 : 200,
        data: response,
        message:
          response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
      });
    } else if (userTypesData && userTypesData?.typeName === "doctor") {
      let obj = {};
      if (reqBody?.appointmentDate) {
        obj.appointmentDate = reqBody.appointmentDate;
      }
      if (reqBody?.appointmentTime) {
        obj.appointmentTime = reqBody.appointmentTime;
      }
      if (reqBody?.businessId) {
        obj.businessId = reqBody.businessId;
      }

      if (reqBody?.status) {
        obj.status = reqBody.status;
      }

      const response = await Appointment.update(obj, {
        where: { id: req.params.appointmentId },
      });

      return res.status(200).json({
        status: response[0] === 0 ? 404 : 200,
        data: response,
        message:
          response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
      });
    } else if (userTypesData && userTypesData?.typeName === "patient") {
      let obj = {};
      if (reqBody?.appointmentDate) {
        obj.appointmentDate = reqBody.appointmentDate;
      }
      if (reqBody?.appointmentTime) {
        obj.appointmentTime = reqBody.appointmentTime;
      }
      if (reqBody?.businessId) {
        obj.businessId = reqBody.businessId;
      }
      if (reqBody?.doctorId) {
        obj.doctorId = reqBody.doctorId;
      }
      if (reqBody?.status === "cancel") {
        obj.status = reqBody.status;
      }
      const response = await Appointment.update(obj, {
        where: { id: req.params.appointmentId },
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
        .json({ message: "Please login to edit the appointment data!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const deleteAppointmentByAdmin = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.userTypeId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const response = await Appointment.findOne({
        where: { id: req.params.appointmentId },
      });
      if (response) {
        await Appointment.destroy({
          where: { id: req.params.appointmentId },
        });
        return res.status(200).json({
          message: "Appoinment data deleted Successfully!",
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
  createAppointment,
  fetchAllAppointment,
  fetchAppointmentByAppointmentId,
  fetchAllAppointmentByUserIdOrDoctorId,
  updateAppointmentByAppointmentId,
  deleteAppointmentByAdmin,
};
