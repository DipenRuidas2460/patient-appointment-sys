const express = require("express");
const upload = require("express-fileupload");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const nocache = require("nocache");
const { validateTokenMiddleware } = require("./middleware/auth");

app.use(nocache());
app.use(cors());
app.use(upload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials"
  );
  next();
});

const secureRoutes = require("./routes/secureRoutes");
const unSecureRoutes = require("./routes/unSecureRoutes");
app.use("/api", validateTokenMiddleware, secureRoutes);
app.use("/api", unSecureRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is connected at port ${process.env.APP_PORT}`);
});
