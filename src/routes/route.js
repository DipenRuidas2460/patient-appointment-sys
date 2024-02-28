const express = require("express");
const router = express.Router();

const {
  login,
  addUser,
  forgetPass,
  fpUpdatePass,
  logOut,
} = require("../controllers/userController");

const { validateTokenMiddleware } = require("../middleware/auth");

const { getProfileImage } = require("../helper/fileHelper");

// -------------------- User Profile Route ----------------------------------------------------------------------------------

router.post("/user/register", addUser);
router.get("/assets/image/:fileName", getProfileImage);
router.post("/user/login", login);
router.get("/user/logout", logOut);
router.post("/user/forgotpass", forgetPass);
router.post("/user/resetpass", fpUpdatePass);
// router.put("/user/update", validateTokenMiddleware, );

module.exports = router;
