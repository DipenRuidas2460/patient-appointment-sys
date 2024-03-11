const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const AppointmentController = require("../controllers/AppointmentController");
const AppController = require("../controllers/AppController");
const BusinessController = require("../controllers/BusinessController");
const { validateTokenMiddleware } = require("../middleware/auth");

// --------------------------- Auth Routes ---------------------------------------------------------------------
router.post("/login", AuthController.loginUser);
router.post("/ping", AuthController.ping);

// ------------------------ Business Routes --------------------------------------------------------------------
router.post("/business/register", BusinessController.registerBusiness);
router.get(
  "/business-All-business-timing/via-token",
  validateTokenMiddleware,
  BusinessController.fetchBusinessAndAllBusinessTiming
);

// ---------------------------- Dashboard Routes ----------------------------------------------------------------
router.post(
  "/dashboard",
  validateTokenMiddleware,
  AppController.fetchAllAppointsmentsAndExpert
);
router.post(
  "/appointments/today",
  validateTokenMiddleware,
  AppController.fetchAllTodaysAppointsments
);

router.post(
  "/appointments/recent",
  validateTokenMiddleware,
  AppController.fetchAllRecentAppointsments
);

// ---------------------------------- Appointment Routes -----------------------------------------------------------

router.post(
  "/appointments/available",
  validateTokenMiddleware,
  AppointmentController.getAppointmentSlot
);

router.post(
  "/appointments/create",
  validateTokenMiddleware,
  AppointmentController.createAppointment
);

router.delete(
  "/appointments/destroy",
  validateTokenMiddleware,
  AppointmentController.deleteAppointment
);

router.post(
  "/appointments/all",
  validateTokenMiddleware,
  AppointmentController.getAllAppointment
);

router.put(
  "/appointments/accept",
  validateTokenMiddleware,
  AppointmentController.acceptAppointment
);

router.put(
  "/appointments/checkin",
  validateTokenMiddleware,
  AppointmentController.checkInAppointment
);

router.post(
  "/appointment/customer/all",
  validateTokenMiddleware,
  AppointmentController.getAllCustomer
);

router.post(
  "/appointment/expert/all",
  validateTokenMiddleware,
  AppointmentController.getAllExpert
);

// --------------------------------- other Routes ------------------------------------------------------------------

router.post(
  "/customer/all",
  validateTokenMiddleware,
  AppController.getAllCustomer
);
router.post("/expert/all", validateTokenMiddleware, AppController.getAllExpert);
router.post(
  "/user/create",
  validateTokenMiddleware,
  AppController.addCustomerOrExpert
);
router.put(
  "/user/update",
  validateTokenMiddleware,
  AppController.updateCustomerOrExpert
);
router.delete(
  "/user/delete/:id",
  validateTokenMiddleware,
  AppController.deleteCustomerOrExpert
);

module.exports = router;
