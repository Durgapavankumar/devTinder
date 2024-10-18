const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Invalid Tokkeeen ");
    }
    const decodedObj = await jwt.verify(token, "Durga@123");
    const { _id } = decodedObj;
    const user = await Users.findById({ _id });
    if (!user) {
      throw new Error("Invalid User");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
