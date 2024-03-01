const asyncHandler = require("express-async-handler");
const BusinessTiming = require("../models/businessTiming");
const UserTypes = require("../models/userType");
const { getTimeDifference } = require("../helper/side");
const Business = require("../models/business");

const createBusinessTiming = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.roleId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const totalTime = getTimeDifference(
        req.body.openingTime,
        req.body.closingTime
      );

      const lunchBreak = getTimeDifference(
        req.body.lunchTimeStart,
        req.body.lunchTimeEnd
      );

      const timeDiff = totalTime - lunchBreak;
      if (req.body.sessionTimeInMinutes && req.body.breakTimeInMinutes) {
        req.body.noOfSession = Math.floor(
          timeDiff /
            (req.body.sessionTimeInMinutes + req.body.breakTimeInMinutes)
        );
      }

      const response = await BusinessTiming.create(req.body);
      return res.status(201).json({
        status: true,
        response,
        message: "Business Timing data created successfully!",
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

const fetchAllBusinessTiming = asyncHandler(async (req, res) => {
  try {
    const response = await BusinessTiming.findAll(
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

const fetchBusinessTimingById = asyncHandler(async (req, res) => {
  try {
    const response = await BusinessTiming.findOne(
      {
        where: { id: req.params.businessTimingId },
      },
      {
        include: [
          {
            model: Business,
            as: "business",
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

const updateBusinessTimingByAdmin = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.roleId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const businessTiming = await BusinessTiming.findOne({
        where: { id: req.params.businessTimingId },
      });

      let totalTime = null;
      let lunchBreak = null;

      if (req.body.openingTime && req.body.closingTime) {
        totalTime = getTimeDifference(
          req.body.openingTime,
          req.body.closingTime
        );
      } else if (req.body.openingTime || req.body.closingTime) {
        totalTime = getTimeDifference(
          req.body.openingTime
            ? req.body.openingTime
            : businessTiming.openingTime,
          req.body.closingTime
            ? req.body.closingTime
            : businessTiming.closingTime
        );
      } else {
        totalTime = getTimeDifference(
          businessTiming.openingTime,
          businessTiming.closingTime
        );
      }

      if (req.body.lunchTimeStart && req.body.lunchTimeEnd) {
        lunchBreak = getTimeDifference(
          req.body.lunchTimeStart,
          req.body.lunchTimeEnd
        );
      } else if (req.body.lunchTimeStart || req.body.lunchTimeEnd) {
        lunchBreak = getTimeDifference(
          req.body.lunchTimeStart
            ? req.body.lunchTimeStart
            : businessTiming.lunchTimeStart,
          req.body.lunchTimeEnd
            ? req.body.lunchTimeEnd
            : businessTiming.lunchTimeEnd
        );
      } else {
        lunchBreak = getTimeDifference(
          businessTiming.lunchTimeStart,
          businessTiming.lunchTimeEnd
        );
      }

      const timeDiff = totalTime - lunchBreak;

      if (req.body.sessionTimeInMinutes && req.body.breakTimeInMinutes) {
        req.body.noOfSession = Math.floor(
          timeDiff /
            (req.body.sessionTimeInMinutes + req.body.breakTimeInMinutes)
        );
      } else if (req.body.sessionTimeInMinutes || req.body.breakTimeInMinutes) {
        req.body.noOfSession = Math.floor(
          timeDiff /
            (req.body.sessionTimeInMinutes
              ? req.body.sessionTimeInMinutes
              : businessTiming.sessionTimeInMinutes +
                req.body.breakTimeInMinutes
              ? req.body.breakTimeInMinutes
              : businessTiming.breakTimeInMinutes)
        );
      } else {
        const calc = businessTiming.sessionTimeInMinutes
          ? businessTiming.sessionTimeInMinutes
          : null + businessTiming.breakTimeInMinutes;
        if (!isNaN(calc)) {
          req.body.noOfSession = Math.floor(timeDiff / calc);
        }
      }

      const response = await BusinessTiming.update(req.body, {
        where: { id: req.params.businessTimingId },
      });
      return res.status(200).json({
        status: response[0] === 0 ? 404 : 200,
        response,
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

const deleteBusinessTimingByAdmin = asyncHandler(async (req, res) => {
  try {
    const userTypesData = await UserTypes.findOne({
      where: {
        id: req.person.roleId,
      },
    });
    if (userTypesData && userTypesData?.typeName === "admin") {
      const response = await BusinessTiming.findOne({
        where: { id: req.params.businessTimingId },
      });
      if (response) {
        await BusinessTiming.destroy({
          where: { id: req.params.businessTimingId },
        });
        return res.status(200).json({
          message: "Business Timing data deleted Successfully!",
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
  createBusinessTiming,
  fetchAllBusinessTiming,
  fetchBusinessTimingById,
  updateBusinessTimingByAdmin,
  deleteBusinessTimingByAdmin,
};
