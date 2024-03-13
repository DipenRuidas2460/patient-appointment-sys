const { Op } = require("sequelize");
const { encryptPassword } = require("../helpers/main");
const Appointments = require("../models/Appointments");
const User = require("../models/User");
const moment = require("moment");

const fetchAllAppointsmentsAndExpert = async (req, res) => {
  try {
    const appointment = await Appointments.findAndCountAll({
      where: { businessId: req.person.businessId, status: 1 },
    });
    const expert = await User.findAndCountAll({
      where: { businessId: req.person.businessId, userType: 3 },
    });
    return res.status(200).json({
      status: 200,
      data: { appointments: appointment.count, experts: expert.count },
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
    if (req.person.userType === 2 || req.person.userType === 1) {
      const { page, pageSize, filterInput } = req.body;
      const filter = {};
      if (filterInput) {
        filter.name = {
          [Op.like]: `%${filterInput}%`,
        };
      }

      filter.userType = 4;

      await User.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: Number(pageSize),
        where: filter,
        attributes: {
          exclude: ["password", "fpToken"],
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
        .json({ status: 403, message: "Only Admin Can access all data!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const getAllExpert = async (req, res) => {
  try {
    if (req.person.userType === 2 || req.person.userType === 1) {
      const { page, pageSize, filterInput } = req.body;
      const filter = {};
      if (filterInput) {
        filter.name = {
          [Op.like]: `%${filterInput}%`,
        };
      }

      filter.userType = 3;

      await User.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: Number(pageSize),
        where: filter,
        attributes: {
          exclude: ["password", "fpToken"],
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
        .json({ status: 403, message: "Only Admin Can access all data!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const getAdmin = async (req, res) => {
  try {
    await User.findAll({
      where: { id: req.person.id, userType: 2 },
      attributes: {
        exclude: ["password", "fpToken"],
      },
    })
      .then((response) => {
        return res.status(200).json({
          status: 200,
          response,
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

const addCustomerOrExpert = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      city,
      address,
      zipCode,
      dob,
      userType,
    } = req.body;

    let guiId = null;

    if (userType === 4) {
      guiId = `XS-C${Math.floor(Math.random() * 10000)}`;
    } else if (userType === 3) {
      guiId = `XS-E${Math.floor(Math.random() * 10000)}`;
    }

    let profilePhoto = null;
    const randomInRange = Math.floor(Math.random() * 10) + 1;
    if (req?.files?.photo) {
      profilePhoto = req.files.photo;
      const imagePath = join(
        __dirname,
        "../uploads/profileImage/",
        `${randomInRange}_profile_photo`
      );
      await profilePhoto.mv(imagePath);
    }
    const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD, HH:mm");

    if (email != "" || phone != "") {
      const findEmail = await User.findOne({
        where: { email: email },
      });

      const findPhoneNumber = await User.findOne({
        where: { phone: phone },
      });

      if (findEmail) {
        return res
          .status(200)
          .json({ status: 409, msg: "Email is already present!" });
      }

      if (findPhoneNumber) {
        return res.status(200).json({
          status: 409,
          msg: "Phone Number is already present!",
        });
      }
    }

    const passwrd = await encryptPassword(password);

    const newReqData = {
      guiId,
      name,
      email,
      password: passwrd,
      phone,
      city,
      address,
      zipCode,
      dob: new Date(dob),
      photo: profilePhoto ? `${randomInRange}_profile_photo` : null,
      userType: userType,
      businessId: req.person.businessId,
      status: 1,
      createdTime: currentDate,
    };

    await User.create(newReqData)
      .then((userDetails) => {
        if (userDetails) {
          const {
            id,
            guiId,
            name,
            email,
            phone,
            userType,
            businessId,
            status,
            createdTime,
            photo,
            city,
            address,
            zipCode,
            dob,
          } = userDetails;

          const registerUserData = {
            id,
            name,
            guiId,
            email,
            phone,
            userType,
            businessId,
            status,
            photo: photo ? photo : null,
            city,
            address,
            zipCode,
            dob,
            createdTime,
          };

          return res.status(201).json({
            status: 200,
            data: registerUserData,
            message:
              userType === 4
                ? "Customer successfully created!"
                : userType === 3
                ? "Expert successfully created!"
                : "Created",
          });
        } else {
          return res
            .status(200)
            .json({ status: 400, message: "User is not created!" });
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
      .json({ status: 500, message: "Internal Server Error!" });
  }
};

const updateCustomerOrExpert = async (req, res) => {
  try {
    let reqBody = req.body;
    const userData = await User.findOne({ where: { id: reqBody.id } });
    const updateData = {};
    if (!userData) {
      return res.status(200).json({ status: 404, msg: "Data not Present!" });
    }

    let updatedImage = null;
    const randomInRange = Math.floor(Math.random() * 10) + 1;
    const updatedPhotoName = `${randomInRange}_profile_photo`;
    if (req?.files?.photo) {
      updatedImage = req.files.photo;
      const imagePath = join(
        __dirname,
        "../uploads/profileImage/",
        `${userData.photo ? userData.photo : updatedPhotoName}`
      );
      await updatedImage.mv(imagePath);
    }

    if (reqBody.name) {
      updateData.name = reqBody.name
    }

    if (reqBody.email) {
      updateData.email = reqBody.email;
    }

    if (reqBody.address) {
      updateData.address = reqBody.address;
    }

    if (reqBody.city) {
      updateData.city = reqBody.city;
    }

    if (reqBody.zipCode) {
      updateData.zipCode = reqBody.zipCode;
    }

    if (reqBody.phone) {
      updateData.phone = reqBody.phone;
    }

    if (reqBody.status) {
      updateData.status = reqBody.status;
    }

    if (reqBody.password) {
      updateData.password = await encryptPassword(reqBody.password);
    }

    if (updatedImage) {
      updateData.photo = userData.photo ? userData.photo : updatedPhotoName;
    }

    if (reqBody.dob) {
      updateData.dob = new Date(reqBody.dob);
    }

    await User.update(updateData, {
      where: { id: reqBody.id },
    })
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
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
};

const deleteCustomerOrExpert = async (req, res) => {
  try {
    await User.findOne({ where: { id: req.params.id } })
      .then(async (userData) => {
        if (userData) {
          await User.destroy({
            where: { id: req.params.id },
          });

          return res.status(200).json({
            status: 200,
            message: "Data deleted successfully!",
          });
        } else {
          return res
            .status(200)
            .json({ status: 404, message: "User data not found!" });
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

const fetchAllRecentAppointsments = async (req, res) => {
  try {
    const { page, pageSize } = req.body;
    await Appointments.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
      order: [["createdAt", "ASC"]],
      where: { businessId: req.person.businessId, status: 1 },
      include: [
        {
          model: User,
          as: "customers",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: User,
          as: "experts",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
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
};

const fetchAllTodaysAppointsments = async (req, res) => {
  try {
    const { page, pageSize } = req.body;
    const dateObject = new Date();
    dateObject.setHours(0, 0, 0, 0);
    await Appointments.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
      order: [["createdAt", "ASC"]],
      where: {
        [Op.and]: [
          { businessId: req.person.businessId },
          { status: 2 },
          {
            slot: {
              [Op.gte]: dateObject,
              [Op.lt]: new Date(dateObject.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
      include: [
        {
          model: User,
          as: "customers",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: User,
          as: "experts",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
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
};

module.exports = {
  fetchAllAppointsmentsAndExpert,
  getAllCustomer,
  addCustomerOrExpert,
  deleteCustomerOrExpert,
  updateCustomerOrExpert,
  getAllExpert,
  fetchAllRecentAppointsments,
  fetchAllTodaysAppointsments,
  getAdmin,
};
