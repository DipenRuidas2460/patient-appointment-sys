const Appoinments = require("../models/Appointments");
const { Op } = require("sequelize");
const { getDayName } = require("../helpers/main");
const BusinessTiming = require("../models/BusinessTiming");
const Appointments = require("../models/Appointments");
const User = require("../models/User");
const moment = require("moment-timezone");

async function generateAvailableSlots(businessTiming, requestDate) {
  const availableSlot = [];

  const dateObject = new Date(requestDate);
  const openTimeParts = businessTiming.openTime.split(":");
  const closeTimeParts = businessTiming.closeTime.split(":");
  const lunchStartTimeParts = businessTiming.lunchStart.split(":");
  const lunchEndTimeParts = businessTiming.lunchEnd.split(":");

  let startTime = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth(),
    dateObject.getDate(),
    parseInt(openTimeParts[0]),
    parseInt(openTimeParts[1])
  );

  const closeTime = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth(),
    dateObject.getDate(),
    parseInt(closeTimeParts[0]),
    parseInt(closeTimeParts[1])
  );

  const lunchStart = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth(),
    dateObject.getDate(),
    parseInt(lunchStartTimeParts[0]),
    parseInt(lunchStartTimeParts[1])
  );

  const lunchEnd = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth(),
    dateObject.getDate(),
    parseInt(lunchEndTimeParts[0]),
    parseInt(lunchEndTimeParts[1])
  );

  const bookedAppointments = await Appoinments.findAll({
    where: {
      slot: {
        [Op.gte]: dateObject,
        [Op.lt]: new Date(dateObject.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  const bookedSlots = bookedAppointments?.map(
    (appointment) => appointment.slot
  );

  while (startTime < closeTime) {
    const slotEndTime = new Date(startTime);
    slotEndTime.setMinutes(slotEndTime.getMinutes() + businessTiming.slotTime);

    if (!bookedSlots.some((slot) => slot.getTime() === startTime.getTime())) {
      availableSlot.push({ start: new Date(startTime), end: slotEndTime });
    }

    startTime.setMinutes(
      startTime.getMinutes() +
        (businessTiming.slotTime + businessTiming.breakTime)
    );

    if (startTime >= lunchStart && startTime < lunchEnd) {
      startTime = new Date(lunchEnd);
    }
  }

  return availableSlot;
}

const getAppointmentSlot = async (req, res) => {
  try {
    const { date } = req.body;

    const dayName = getDayName(date);

    await BusinessTiming.findOne({
      where: {
        businessId: req.person.businessId,
        dayName: dayName,
      },
    })
      .then(async (response) => {
        const responseData = await generateAvailableSlots(response, date);

        return res.status(200).json({ status: 200, data: responseData });
      })
      .catch((err) => {
        return res
          .status(200)
          .json({ status: 400, message: "An Error Occured!" });
      });
  } catch (error) {
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const createAppointment = async (req, res) => {
  try {
    if (req.person.userType !== 3) {
      const reqBody = req.body;
      if (req.person.userType === 4) {
        reqBody.customerId = req.person.id;
      }
      const currentDate = moment().format("YYYY-MM-DD, HH:mm:ss");
      reqBody.businessId = req.person.businessId;
      reqBody.createdAt = currentDate;
      await Appointments.create(reqBody)
        .then((response) => {
          return res.status(201).json({
            status: 200,
            response,
            message: "Appointment created successfully!",
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(200)
            .json({ status: 400, message: "An Error Occured!" });
        });
    } else {
      return res
        .status(200)
        .json({ status: 403, message: "Expert not created appointment!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const { page, pageSize } = req.body;
    if (req.person.userType === 2 || req.person.userType === 1) {
      await Appoinments.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: Number(pageSize),
        where: { businessId: req.person.businessId },
        attributes: {
          exclude: ["createAt", "updatedAt"],
        },
      })
        .then(({ count, rows }) => {
          return res.status(200).json({
            status: 200,
            data: rows,
            pagination: {
              totalItems: count,
              totalPages: Math.ceil(count / pageSize),
              currentPage: page,
              pageSize: pageSize,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(200)
            .json({ status: 400, message: "An Error Occured!" });
        });
    } else if (req.person.userType === 3) {
      await Appoinments.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: Number(pageSize),
        where: { businessId: req.person.businessId, expertId: req.person.id },
        attributes: {
          exclude: ["createAt", "updatedAt"],
        },
      })
        .then(({ count, rows }) => {
          return res.status(200).json({
            status: 200,
            data: rows,
            pagination: {
              totalItems: count,
              totalPages: Math.ceil(count / pageSize),
              currentPage: page,
              pageSize: pageSize,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(200)
            .json({ status: 400, message: "An Error Occured!" });
        });
    } else if (req.person.userType === 4) {
      await Appoinments.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: Number(pageSize),
        where: { businessId: req.person.businessId, customerId: req.person.id },
        attributes: {
          exclude: ["createAt", "updatedAt"],
        },
      })
        .then(({ count, rows }) => {
          return res.status(200).json({
            status: 200,
            data: rows,
            pagination: {
              totalItems: count,
              totalPages: Math.ceil(count / pageSize),
              currentPage: page,
              pageSize: pageSize,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(200)
            .json({ status: 400, message: "An Error Occured!" });
        });
    } else {
      return res
        .status(200)
        .json({ status: 403, message: "Please login first!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const acceptAppointment = async (req, res) => {
  try {
    if (req.person.userType === 2 || req.person.userType === 1) {
      const currentDate = moment().format("YYYY-MM-DD, HH:mm:ss");
      await Appoinments.update(
        { status: 2, updatedAt: currentDate },
        { where: { id: req.body.appointmentId } }
      )
        .then((response) => {
          return res.status(200).json({
            status: response[0] === 0 ? 203 : 200,
            message:
              response[0] === 0 ? "No Changes made!" : "Successfully Updated!",
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(200)
            .json({ status: 400, message: "An Error Occured!" });
        });
    } else {
      return res.status(200).json({
        status: 403,
        message: "Only Admin Can Confirm the appointment!",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const checkInAppointment = async (req, res) => {
  try {
    if (req.person.userType !== 4) {
      const currentDate = moment().format("YYYY-MM-DD, HH:mm:ss");
      await Appoinments.update(
        { status: 3, updatedAt: currentDate },
        { where: { id: req.body.appointmentId } }
      )
        .then((response) => {
          return res.status(200).json({
            status: response[0] === 0 ? 203 : 200,
            message:
              response[0] === 0 ? "No Changes made!" : "Successfully Updated!",
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(200)
            .json({ status: 400, message: "An Error Occured!" });
        });
    } else {
      return res.status(200).json({
        status: 403,
        message: "User not check-in by self!",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await Appoinments.findOne({ where: { id: req.params.appointmentId } })
      .then(async (response) => {
        if (response) {
          await Appoinments.destroy({
            where: { id: req.params.appointmentId },
          });

          return res.status(200).json({
            status: 200,
            message: "Appointment Data delete successfully!",
          });
        } else {
          return res
            .status(200)
            .json({ status: 404, message: "Appointment data not found!" });
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
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const getAllCustomer = async (req, res) => {
  try {
    await User.findAll({
      where: { userType: 4, status: 1 },
    })
      .then((data) => {
        return res.status(200).json({
          status: 200,
          data: data,
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
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const getAllExpert = async (req, res) => {
  try {
    await User.findAll({
      where: { userType: 3, status: 1 },
    })
      .then((data) => {
        return res.status(200).json({
          status: 200,
          data: data,
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
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = {
  getAppointmentSlot,
  deleteAppointment,
  createAppointment,
  getAllAppointment,
  acceptAppointment,
  checkInAppointment,
  getAllCustomer,
  getAllExpert,
};
