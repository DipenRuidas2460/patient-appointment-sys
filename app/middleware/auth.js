const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateTokenMiddleware = (req, res, next) => {
  const secretKey = process.env.APPTOKEN;
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(200)
      .json({ status: 401, msg: "Not Authorized, Please Login!" });
  }
  token = token.split(" ")[1];
  try {
    const decodedToken = verify(token, secretKey);
    if (decodedToken) {
      req.person = decodedToken;
      req.person.id = decodedToken.id;
      req.person.userType = decodedToken.userType;
      req.person.businessId = decodedToken.businessId;
      next();
    } else {
      return res.status(200).json({ status: 401, error: "unauthorized" });
    }
  } catch (error) {
    return res.status(200).json({ status: 401, error: "unauthorized" });
  }
};

module.exports = { validateTokenMiddleware };