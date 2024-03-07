const asyncHandler = require("express-async-handler");
const UserTypes = require("../models/UserType");

const createUserTypes = asyncHandler(async (req, res) => {
  try {
    await UserTypes.create(req.body)
      .then((response) => {
        return res.status(201).json({
          status: 200,
          response,
          message: "UserTypes data created successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(200)
          .json({ status: 400, message: "An Error Occured!" });
      });
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
});

const fetchAllUserTypes = asyncHandler(async (req, res) => {
  try {
    await UserTypes.findAll({})
      .then((response) => {
        return res.status(200).json({
          status: response.length > 0 ? 200 : 404,
          response,
          message:
            response.length > 0
              ? "Successfully fetch data"
              : "Data not present!",
        });
      })
      .catch(() => {
        console.log(err);
        return res
          .status(200)
          .json({ status: 400, message: "An Error Occured!" });
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(200)
      .json({ status: 500, message: "Internal Server Error!" });
  }
});

const updateUserTypes = asyncHandler(async (req, res) => {
  try {
    await UserTypes.update(req.body, {
      where: { id: req.params.userTypeId },
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

const deleteUserTypes = asyncHandler(async (req, res) => {
  try {
    await UserTypes.findOne({
      where: { id: req.params.userTypeId },
    })
      .then(async (response) => {
        if (response) {
          await UserTypes.destroy({
            where: { id: req.params.userTypeId },
          }).then(() => {
            return res.status(200).json({
              message: "UserTypes data deleted Successfully!",
            });
          });
        } else {
          return res
            .status(200)
            .json({ status: 404, message: "Data not found!" });
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
});

module.exports = {
  createUserTypes,
  fetchAllUserTypes,
  updateUserTypes,
  deleteUserTypes,
};
