const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const BusinessController = require("../controllers/BusinessController");

router.post("/login", AuthController.loginUser);
router.post("/business/register", BusinessController.registerBusiness);

module.exports = router;
