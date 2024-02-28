const { readFileSync } = require("fs");
const { join } = require("path");

const getProfileImage = async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = "../uploads/profileImage/" + fileName;
  const profileImagePath = join(__dirname, filePath);
  const file = readFileSync(profileImagePath);
  res.write(file);
  res.end();
};

module.exports =  { getProfileImage };