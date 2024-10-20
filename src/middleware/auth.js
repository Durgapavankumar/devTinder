const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Invalid Token");
    }

    // Verify the JWT token and get the decoded object
    const decodedObj = jwt.verify(token, "Durga@123");
    const { _id } = decodedObj;

    // Use `findById` with the actual _id, not an object
    const user = await Users.findById(_id);
    if (!user) {
      throw new Error("Invalid User");
    }

    // Attach the user to the request object for future use
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
