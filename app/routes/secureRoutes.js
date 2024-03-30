const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const AppointmentController = require("../controllers/AppointmentController");
const AppController = require("../controllers/AppController");
const BusinessController = require("../controllers/BusinessController");
const CustomerBusinessController = require("../controllers/CustomerBusinessController");

// --------------------------- Auth Routes ---------------------------------------------------------------------
router.post("/ping", AuthController.ping);

// ------------------------ Business Routes --------------------------------------------------------------------
router.get(
  "/business-All-business-timing/via-token",
  BusinessController.fetchBusinessAndAllBusinessTiming
);

// ---------------------------- Dashboard Routes ----------------------------------------------------------------
router.post("/dashboard", AppController.fetchAllAppointsmentsAndExpert);
router.post("/appointments/today", AppController.fetchAllTodaysAppointsments);

router.post("/appointments/recent", AppController.fetchAllRecentAppointsments);

// ---------------------------------- Appointment Routes -----------------------------------------------------------

router.post(
  "/appointments/available",
  AppointmentController.getAppointmentSlot
);

router.post("/appointments/create", AppointmentController.createAppointment);

router.delete(
  "/appointments/destroy/:appointmentId",
  AppointmentController.deleteAppointment
);

router.post("/appointments/all", AppointmentController.getAllAppointment);

router.put("/appointments/accept", AppointmentController.acceptAppointment);

router.put("/appointments/update", AppointmentController.updateAppointment);

router.post("/appointment/customer/all", AppointmentController.getAllCustomer);

router.post("/appointment/expert/all", AppointmentController.getAllExpert);

// --------------------------------- Customer Business Routes ------------------------------------------------------

router.post("/customer-business/create", CustomerBusinessController.createCustomerBusiness);

router.post("/customer-business/all", CustomerBusinessController.fetchAllCustomerByBusinessId);

// --------------------------------- other Routes ------------------------------------------------------------------

router.post("/customer/all", AppController.getAllCustomer);
router.post("/expert/all", AppController.getAllExpert);
router.post("/user/create", AppController.addCustomerOrExpert);
router.put("/user/update", AppController.updateCustomerOrExpert);
router.get("/admin/all", AppController.getAdmin);
router.delete("/user/delete/:id", AppController.deleteCustomerOrExpert);

module.exports = router;
