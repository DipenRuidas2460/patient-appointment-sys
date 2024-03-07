const Appoinments = require("../models/Appointments");
const { Op } = require("sequelize");
const { getDayName } = require("../helper/side");
const BusinessTiming = require("../models/BusinessTiming");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

async function generateAvailableSlots(businessTiming, requestDate, req, res) {
  const availableSlot = [];

  const dateObject = new Date(requestDate);
  const openTimeParts = businessTiming.openTime.split(":");
  const closeTimeParts = businessTiming.closeTime.split(":");
  const lunchStartTimeParts = businessTiming.lunchStart.split(":");
  const lunchEndTimeParts = businessTiming.lunchEnd.split(":");

  let startTime = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth() + 1,
    dateObject.getDate(),
    parseInt(openTimeParts[0]),
    parseInt(openTimeParts[1])
  );

  const closeTime = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth() + 1,
    dateObject.getDate(),
    parseInt(closeTimeParts[0]),
    parseInt(closeTimeParts[1])
  );

  const lunchStart = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth() + 1,
    dateObject.getDate(),
    parseInt(lunchStartTimeParts[0]),
    parseInt(lunchStartTimeParts[1])
  );

  const lunchEnd = new Date(
    dateObject.getFullYear(),
    dateObject.getMonth() + 1,
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
    if (!bookedSlots?.includes(startTime)) {
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
    const { date, businessId } = req.body;

    const dayName = getDayName(date);

    await BusinessTiming.findOne({
      where: {
        businessId: businessId,
        dayName: dayName,
      },
    })
      .then(async (response) => {
        const responseData = await generateAvailableSlots(
          response,
          date,
          req,
          res
        );
        return res.status(200).json({ status: 200, data: responseData });
      })
      .catch((err) => {
        console.log("error:-", err);
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

const fetchAllAppointsmentsAndExpert = asyncHandler(async (req, res) => {
  try {
    const { businessId } = req.body;
    const { count1, rows1 } = await Appoinments.findAndCountAll({
      where: { businessId: businessId },
    });
    const { count2, rows2 } = await User.findAndCountAll({
      where: { businessId: businessId, userTypeId: 3 },
    });

    return res
      .status(200)
      .json({ status: 200, data: { appointments: count1, experts: count2 } });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
});

const fetchAllRecentOrTodayAppointsments = asyncHandler(async (req, res) => {
  try {
    const { businessId, status, page, pageSize } = req.body;

    await Appoinments.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
      where: { businessId: businessId, status: status },
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
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
});

module.exports = {
  getAppointmentSlot,
  fetchAllAppointsmentsAndExpert,
  fetchAllRecentOrTodayAppointsments,
};
