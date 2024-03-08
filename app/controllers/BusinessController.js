const Business = require("../models/Business");
const BusinessTiming = require("../models/BusinessTiming");
const User = require("../models/User");
const sequelize = require("../config/dbConfig");
const { encryptPassword } = require("../helpers/main");

const registerBusiness = async (req, res) => {
  try {
    let transaction;
    try {
      // Begin a transaction
      transaction = await sequelize.transaction();

      // Extract business information from the request
      const { businessInfo, businessTime, userInfo } = req.body;

      // Create a new Business instance with the extracted information
      const newBusiness = await Business.create(
        {
          businessName: businessInfo.businessName,
          category: businessInfo.category,
          address: businessInfo.address,
          city: businessInfo.city,
          state: businessInfo.state,
          zipCode: businessInfo.zipCode,
          phoneNo: businessInfo.phone,
          email: businessInfo.email,
        },
        { transaction }
      );

      // Create business timings
      for (const timing of businessTime) {
        await BusinessTiming.create(
          {
            businessId: newBusiness.id,
            dayName: timing.dayName,
            openTime: timing.openTime,
            closeTime: timing.closeTime,
            lunchStart: timing.lunchStart,
            lunchEnd: timing.lunchEnd,
            slotTime: 45,
            breakTime: timing.breakTime,
          },
          { transaction }
        );
      }

      // Create admin user for the business
      await User.create(
        {
          name: userInfo.name,
          email: userInfo.email,
          password: await encryptPassword(userInfo.password),
          phone: userInfo.phone,
          city: userInfo.city,
          state: userInfo.state,
          zipCode: userInfo.zipCode,
          dob: userInfo.dob,
          userType: 2, // Business Admin
          businessId: newBusiness.id, // Assign the business ID to the admin user
        },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();

      // Return the newly created business
      return res.status(200).json({
        status: 200,
        data: newBusiness,
        message: "Business Created Successfully",
      });
    } catch (error) {
      // Rollback the transaction if there's an error
      if (transaction) await transaction.rollback();

      // Handle errors
      console.error("Error creating business with timing and admin:", error);
      throw error; // Rethrow the error for handling elsewhere if necessary
    }
  } catch (error) {
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const fetchBusinessAndAllBusinessTiming = async (req, res) => {
  try {
    await Business.findOne({
      where: { id: req.person.businessId },
    })
      .then(async (businessData) => {
        if (businessData) {
          await BusinessTiming.findAll({
            where: { businessId: businessData.id },
          })
            .then((businessTiming) => {
              return res
                .status(200)
                .json({
                  status: 200,
                  businessData,
                  businessTiming,
                  msg: "Data fetch Success!",
                });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(200)
                .json({ status: 400, msg: "An Error Occured!" });
            });
        } else {
          return res.status(200).json({ status: 404, msg: "Data not found!" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(200).json({ status: 400, msg: "An Error Occured!" });
      });
  } catch (error) {
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = {
  registerBusiness,
  fetchBusinessAndAllBusinessTiming,
};
