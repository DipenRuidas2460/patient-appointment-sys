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
  createAvailability,
  fetchAvailability,
  fetchAvailabilityById,
  updateAvailability,
  deleteAvailabilityByAdmin,
  fetchAvailabilityByDoctorId,
} = require("../controllers/availabilityController");
const {
  createWeekDays,
  fetchWeekDays,
  fetchWeekDaysById,
  updateWeekDaysByAdmin,
  deleteWeekDaysByAdmin,
  fetchWeekDaysByClinicId,
} = require("../controllers/weekdaysController");

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

// -------------------- Doctor Availability Route ----------------------------------------------------------------------------------

router.post(
  "/doctor/create-availability",
  validateTokenMiddleware,
  createAvailability
);
router.get(
  "/doctor/fetch-all-availability",
  validateTokenMiddleware,
  fetchAvailability
);
router.get(
  "/doctor/fetch-availability-byId/:availableId",
  validateTokenMiddleware,
  fetchAvailabilityById
);
router.get(
  "/doctor/fetch-availability-DoctorId/:doctorId",
  validateTokenMiddleware,
  fetchAvailabilityByDoctorId
);
router.put(
  "/doctor/update-availability-byId/:availableId",
  validateTokenMiddleware,
  updateAvailability
);
router.delete(
  "/doctor/delete-availability-byId/:availableId",
  validateTokenMiddleware,
  deleteAvailabilityByAdmin
);

// -------------------- WeekDays Route ----------------------------------------------------------------------------------

router.post(
  "/weekDays/create-WeekDays",
  validateTokenMiddleware,
  createWeekDays
);
router.get(
  "/weekDays/fetch-all-weekDays",
  validateTokenMiddleware,
  fetchWeekDays
);
router.get(
  "/weekDays/fetch-weekDays-byId/:weekDayId",
  validateTokenMiddleware,
  fetchWeekDaysById
);
router.get(
  "/weekDays/fetch-weekDays-clinicId/:clinicId",
  validateTokenMiddleware,
  fetchWeekDaysByClinicId
);
router.put(
  "/weekDays/update-weekDays-byId/:weekDayId",
  validateTokenMiddleware,
  updateWeekDaysByAdmin
);
router.delete(
  "/weekDays/delete-weekDays-byId/:weekDayId",
  validateTokenMiddleware,
  deleteWeekDaysByAdmin
);

module.exports = router;
