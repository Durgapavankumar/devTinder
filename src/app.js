const express = require("express");

const app = express();

const User = require("./models/user");
const bcrypt = require("bcrypt");

const { connectDb } = require("./config/database");
const { after } = require("node:test");
const { Error } = require("mongoose");
const jwt = require("jsonwebtoken");

const { validateSignUpData } = require("./utils/uservalidation");
const { userAuth } = require("./middleware/auth");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " Connection request was sent successfully");
});
connectDb()
  .then(() => {
    console.log("Successfully connected to the database");
    app.listen(3000, () => {
      console.log("Server is running successfully");
    });
  })
  .catch((err) => {
    console.log("database not connected");
  });
