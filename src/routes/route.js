const express = require("express");
const router = express.Router();

const {
  login,
  addUser,
  forgetPass,
  fpUpdatePass,
  logOut,
  updateUser,
  updateUserByAdmin,
  getUserById,
  getUserByAdminThroughId,
  getAllUsers,
  deleteUserByAdminThroughId,
  updatePassword,
} = require("../controllers/userController");

const { validateTokenMiddleware } = require("../middleware/auth");

const { getProfileImage } = require("../helper/fileHelper");

const {
  createUserTypes,
  fetchAllUserTypes,
  updateUserTypes,
  deleteUserTypes,
} = require("../controllers/userTypeController");

const {
  createBusiness,
  fetchAllBusiness,
  fetchBusinessById,
  updateBusinessByAdmin,
  deleteBusinessByAdmin,
} = require("../controllers/businessController");

const {
  createBusinessTiming,
  fetchAllBusinessTiming,
  fetchBusinessTimingById,
  updateBusinessTimingByAdmin,
  deleteBusinessTimingByAdmin,
} = require("../controllers/businessTimingController");

// -------------------- User Profile Route ----------------------------------------------------------------------------------

router.post("/user/register", addUser);
router.get("/assets/image/:fileName", getProfileImage);
router.post("/user/login", login);
router.get("/user/logout", logOut);
router.post("/user/forgotpass", forgetPass);
router.post("/user/resetpass", fpUpdatePass);
router.put("/user/update", validateTokenMiddleware, updateUser);
router.put(
  "/user/update-by-admin/:userId",
  validateTokenMiddleware,
  updateUserByAdmin
);
router.patch("/user/updatePassword", validateTokenMiddleware, updatePassword);
router.get("/user/getUserById", validateTokenMiddleware, getUserById);
router.get("/user/getAllUsers", validateTokenMiddleware, getAllUsers);
router.get(
  "/user/getUser-by-admin/:userId",
  validateTokenMiddleware,
  getUserByAdminThroughId
);
router.delete(
  "/user/deleteUser-by-admin/:userId",
  validateTokenMiddleware,
  deleteUserByAdminThroughId
);

// -------------------- userTypes Route ----------------------------------------------------------------------------------

router.post("/userTypes/create", createUserTypes);
router.get("/userTypes/fetch-all-userTypes", fetchAllUserTypes);
router.put("/userTypes/update/:userTypeId", updateUserTypes);
router.delete("/userTypes/delete/:userTypeId", deleteUserTypes);

// -------------------- Business Route ----------------------------------------------------------------------------------

router.post(
  "/business/create-business",
  validateTokenMiddleware,
  createBusiness
);
router.get("/business/fetch-all-business", fetchAllBusiness);
router.get("/business/fetch-business-byId/:businessId", fetchBusinessById);
router.put(
  "/business/update-business-By-Admin/:businessId",
  validateTokenMiddleware,
  updateBusinessByAdmin
);
router.delete(
  "/business/delete-business-By-Admin/:businessId",
  validateTokenMiddleware,
  deleteBusinessByAdmin
);

// -------------------- Business Timing Route ----------------------------------------------------------------------------------

router.post(
  "/business-timing/create-businessTiming",
  validateTokenMiddleware,
  createBusinessTiming
);
router.get("/business-timing/fetch-all-businessTiming", fetchAllBusinessTiming);
router.get(
  "/business-timing/fetch-businessTiming-byId/:businessTimingId",
  fetchBusinessTimingById
);
router.put(
  "/business-timing/update-businessTiming-By-Admin/:businessTimingId",
  validateTokenMiddleware,
  updateBusinessTimingByAdmin
);
router.delete(
  "/business-timing/delete-businessTiming-By-Admin/:businessTimingId",
  validateTokenMiddleware,
  deleteBusinessTimingByAdmin
);

module.exports = router;
