const asyncHandler = require("express-async-handler");
const { join } = require("path");
require("dotenv").config();
const { checkPassword, encryptPassword } = require("../helper/side");
const User = require("../models/User");

const updateUser = asyncHandler(async (req, res) => {
  try {
    let reqBody = req.body;
    const userData = await User.findOne({ where: { id: req.person.id } });

    if (!userData) {
      return res
        .status(200)
        .json({ status: 404, msg: "Logged-In user can edit!" });
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

    if (reqBody.password) {
      reqBody.password = await encryptPassword(reqBody.password);
    }

    if (updatedImage) {
      reqBody.photo = userData.photo ? userData.photo : updatedPhotoName;
    }

    await User.update(reqBody, {
      where: { id: req.person.id },
    })
      .then((response) => {
        return res.status(200).json({
          status: response[0] === 0 ? 404 : 200,
          message:
            response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
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
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  try {
    let reqBody = req.body;
    let userId = req.params.userId;
    if (req.person.id === 1) {
      const userData = await User.findOne({ where: { id: userId } });

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

      if (reqBody.password) {
        reqBody.password = await encryptPassword(reqBody.password);
      }

      if (updatedImage) {
        reqBody.photo = userData.photo ? userData.photo : updatedPhotoName;
      }

      await User.update(reqBody, {
        where: { id: userId },
      })
        .then((response) => {
          return res.status(200).json({
            status: response[0] === 0 ? 404 : 200,
            message:
              response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
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
        .json({ status: 403, message: "Only Admin Can edit!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    await User.findOne({
      where: { id: req.person.id },
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "userTypeId",
        "businessId",
        "status",
        "photo",
      ],
    })
      .then((response) => {
        return res.status(200).json({
          status: response ? 200 : 404,
          data: response,
          profileImage: response.photo
            ? `/assets/image/${response.photo}`
            : null,
          message: response ? "Successfully fetch data" : "User Not Present!",
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

const getUserByAdminThroughId = asyncHandler(async (req, res) => {
  try {
    if (req.person.id === 1 || req.person.id === 2) {
      await User.findOne({
        where: { id: req.params.userId },
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "userTypeId",
          "businessId",
          "status",
          "photo",
        ],
      })
        .then((response) => {
          return res.status(200).json({
            status: response ? 200 : 404,
            data: response,
            profileImage: response.photo
              ? `/assets/image/${response.photo}`
              : null,
            message: response ? "Successfully fetch data" : "User Not Present!",
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
        .json({ status: 403, message: "Only Admin Can access!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const response = await User.findOne({ where: { id: req.person.id } });

    const { oldPassword, password } = req.body;

    if (!response) {
      return res.status(200).json({
        status: 404,
        message: "User not Found, Please Register first!",
      });
    }

    if (!oldPassword || !password) {
      return res
        .status(200)
        .json({ status: 400, message: "Please add Old and new password!" });
    }

    const isPassMatch = await checkPassword(
      oldPassword.trim(),
      response.password
    );

    if (response && isPassMatch) {
      response.password = password;
      await response.save();
      return res.status(200).send({
        status: 200,
        data: response,
        message: "password changed successfully!",
      });
    } else {
      return res
        .status(200)
        .send({ status: 400, message: "oldPassword is incorrect!!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
});

const getAllUsersByAdmin = asyncHandler(async (req, res) => {
  try {
    if (req.person.id === 1) {
      const { page, pageSize, filterInput } = req.body;
      const filter = {};
      if (filterInput) {
        filter.name = {
          [Op.like]: `%${filterInput}%`,
        };
      }
      await User.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: Number(pageSize),
        where: filter,
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
});

const getAllUsersByBusinessAdmin = asyncHandler(async (req, res) => {
  try {
    if (req.person.id === 2) {
      const { page, pageSize, filterInput, userTypeId } = req.body;
      const filter = {};
      if (filterInput) {
        filter.name = {
          [Op.like]: `%${filterInput}%`,
        };
      }

      await User.findAll({ where: { userTypeId: 4 } })
        .then(async (response) => {
          if (response.length > 0) {
            await User.findAndCountAll({
              offset: (page - 1) * pageSize,
              limit: Number(pageSize),
              where: filter,
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
              .json({ status: 404, msg: "Data Not Present!" });
          }
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
        message: "Only Business Admin Can access all data!",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
});

const deleteUserByAdminThroughId = asyncHandler(async (req, res) => {
  try {
    if (req.person.id === 1) {
      await User.findOne({ where: { id: req.params.userId } })
        .then(async (userData) => {
          if (userData) {
            await User.destroy({
              where: { id: req.params.userId },
            });

            return res.status(200).json({
              status: 200,
              message: "User data delete successfully!",
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
    } else {
      return res
        .status(200)
        .json({ status: 403, message: "Only Admin Can access!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error" });
  }
});

module.exports = {
  updateUser,
  getUserById,
  updatePassword,
  getAllUsersByAdmin,
  updateUserByAdmin,
  getUserByAdminThroughId,
  deleteUserByAdminThroughId,
  getAllUsersByBusinessAdmin,
};
