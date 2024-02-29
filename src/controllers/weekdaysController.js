const asyncHandler = require("express-async-handler");
const WeekDays = require("../models/weekdays");
const Clinic = require("../models/clinic");

const createWeekDays = asyncHandler(async (req, res) => {
  try {
    if (req.person.role === "admin") {
      const weekdaysData = await WeekDays.create(req.body);
      const response = await weekdaysData.save();

      return res.status(201).json({
        status: true,
        response,
        message: "WeekDays data created successfully!",
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

const fetchWeekDays = asyncHandler(async (req, res) => {
  try {
    const response = await WeekDays.findAll(
      {},
      {
        include: [
          {
            model: Clinic,
            as: "clinic",
            attributes: {
              exclude: ["createdAt"],
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

const fetchWeekDaysById = asyncHandler(async (req, res) => {
  try {
    const response = await WeekDays.findOne(
      {
        where: { id: req.params.weekDayId },
      },
      {
        include: [
          {
            model: Clinic,
            as: "clinic",
            attributes: {
              exclude: ["createdAt"],
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

const fetchWeekDaysByClinicId = asyncHandler(async (req, res) => {
  try {
    const response = await WeekDays.findOne(
      {
        where: { clinicId: req.params.clinicId },
      },
      {
        include: [
          {
            model: Clinic,
            as: "clinic",
            attributes: {
              exclude: ["createdAt"],
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

const updateWeekDaysByAdmin = asyncHandler(async (req, res) => {
  try {
    if (req.person.role === "admin") {
      const response = await WeekDays.update(req.body, {
        where: { id: req.params.weekDayId },
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

const deleteWeekDaysByAdmin = asyncHandler(async (req, res) => {
  try {
    if (req.person.role === "admin") {
      const weekdaysData = await WeekDays.findOne({
        where: { id: req.params.weekDayId },
      });
      if (weekdaysData) {
        await WeekDays.destroy({
          where: { id: req.params.weekDayId },
        });
        return res.status(200).json({
          message: "WeekDays data deleted Successfully!",
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
  createWeekDays,
  fetchWeekDays,
  fetchWeekDaysById,
  fetchWeekDaysByClinicId,
  updateWeekDaysByAdmin,
  deleteWeekDaysByAdmin,
};
