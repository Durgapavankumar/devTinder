const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/uservalidation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    //validate the user Data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    //Encrypting the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //creating the instance of new user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("New User is created successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    //validation and creating cookie and token using cookie parser and json web token
    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log(token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Successfully logged");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Successfully loggedOut");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;
