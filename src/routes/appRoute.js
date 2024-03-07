const express = require("express");
const router = express.Router();
const AppointmentController = require("../controllers/AppointmentController");
const UserController = require("../controllers/userController");
const { validateTokenMiddleware } = require("../middleware/auth");
const { getProfileImage } = require("../helper/fileHelper");
const UserTypeController = require("../controllers/userTypeController");
const BusinessController = require("../controllers/businessController");
const BusinessTimingController = require("../controllers/businessTimingController");
const AuthController = require("../controllers/AuthController");

// -------------------- userTypes Route ----------------------------------------------------------------------------------

router.post("/userTypes/create", UserTypeController.createUserTypes);
router.get(
  "/userTypes/fetch-all-userTypes",
  UserTypeController.fetchAllUserTypes
);
router.put("/userTypes/update/:userTypeId", UserTypeController.updateUserTypes);
router.delete(
  "/userTypes/delete/:userTypeId",
  UserTypeController.deleteUserTypes
);

// -------------------- User Auth-Routes ---------------------------------------------------------------------------------

router.post("/auth/register", AuthController.addUser);
router.post("/auth/login", AuthController.login);
router.post("/auth/forgotpass", AuthController.forgetPass);
router.post("/auth/resetpass", AuthController.fpUpdatePass);

// -------------------- Profile Picture Access ---------------------------------------------------------------------------
router.get("/assets/image/:fileName", getProfileImage);

// -------------------- User Profile Route ----------------------------------------------------------------------------------

router.put("/user/update", validateTokenMiddleware, UserController.updateUser);
router.put(
  "/user/update-by-admin/:userId",
  validateTokenMiddleware,
  UserController.updateUserByAdmin
);
router.patch(
  "/user/updatePassword",
  validateTokenMiddleware,
  UserController.updatePassword
);
router.get(
  "/user/getUserById",
  validateTokenMiddleware,
  UserController.getUserById
);
router.post(
  "/user/getAllUsersByAdmin",
  validateTokenMiddleware,
  UserController.getAllUsersByAdmin
);

router.post(
  "/user/getAllUsersByBusinessAdmin",
  validateTokenMiddleware,
  UserController.getAllUsersByBusinessAdmin
);
router.get(
  "/user/getUser-by-admin/:userId",
  validateTokenMiddleware,
  UserController.getUserByAdminThroughId
);
router.delete(
  "/user/deleteUser-by-admin/:userId",
  validateTokenMiddleware,
  UserController.deleteUserByAdminThroughId
);

// -------------------- Business Route ----------------------------------------------------------------------------------

router.post(
  "/business/create-business",
  validateTokenMiddleware,
  BusinessController.createBusiness
);
router.get(
  "/business/fetch-all-business",
  validateTokenMiddleware,
  BusinessController.fetchAllBusiness
);
router.get(
  "/business/fetch-business-byId/:businessId",
  validateTokenMiddleware,
  BusinessController.fetchBusinessById
);
router.put(
  "/business/update-business-By-Admin/:businessId",
  validateTokenMiddleware,
  BusinessController.updateBusinessByAdmin
);
router.delete(
  "/business/delete-business-By-Admin/:businessId",
  validateTokenMiddleware,
  BusinessController.deleteBusinessByAdmin
);

// -------------------- Business Timing Route ----------------------------------------------------------------------------------

router.post(
  "/business-timing/create-businessTiming",
  validateTokenMiddleware,
  BusinessTimingController.createBusinessTiming
);
router.get(
  "/business-timing/fetch-all-businessTiming",
  validateTokenMiddleware,
  BusinessTimingController.fetchAllBusinessTiming
);
router.get(
  "/business-timing/fetch-businessTiming-byId/:businessTimingId",
  validateTokenMiddleware,
  BusinessTimingController.fetchBusinessTimingById
);
router.put(
  "/business-timing/update-businessTiming-By-Admin/:businessTimingId",
  validateTokenMiddleware,
  BusinessTimingController.updateBusinessTimingByAdmin
);
router.delete(
  "/business-timing/delete-businessTiming-By-Admin/:businessTimingId",
  validateTokenMiddleware,
  BusinessTimingController.deleteBusinessTimingByAdmin
);

// ------------------------------- Dashboard Routes ----------------------------------------------------
router.post(
  "/appointments/available",
  AppointmentController.getAppointmentSlot
);

router.post(
  "/appointments/today-or-recent",
  validateTokenMiddleware,
  AppointmentController.fetchAllRecentOrTodayAppointsments
);

router.post(
  "/dashboard",
  validateTokenMiddleware,
  AppointmentController.fetchAllAppointsmentsAndExpert
);

module.exports = router;
