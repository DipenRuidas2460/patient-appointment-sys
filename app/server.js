const express = require('express')
const app = express()
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const nocache = require("nocache")

app.use(nocache());
app.use(cors());
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

const appRoute = require("./routes/appRoute");
app.use("/api", appRoute);



app.listen(process.env.APP_PORT, () => {
    console.log(`Server is connected at port ${process.env.APP_PORT}`);
});