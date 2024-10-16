const express = require("express");

const app = express();

const User = require("./models/user");
const bcrypt = require("bcrypt");

const { connectDb } = require("./config/database");
const { after } = require("node:test");
const { Error } = require("mongoose");
const jwt = require("jsonwebtoken");

const { validateSignUpData } = require("./utils/uservalidation");
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    //validation and creating cookie and token using cookie parser and json web token
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "Durga@123");
      console.log(token);
      res.cookie("token", token);
      res.send("Successfully logged");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    // Extract token from the cookies using `req.cookies`
    const token = req.cookies.token;

    if (!token) {
      throw new Error("Invalid token");
    }

    // Verify the token
    const decodedMessage = await jwt.verify(token, "Durga@123");
    const { _id } = decodedMessage;

    // Find the user by decoded _id
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User doesn't exist");
    }

    // Send user information if everything is valid
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/email", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    const user = await User.find({ emailId: userEmail });
    if (!user) {
      res.status(404).send("Error not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.send("Error finding the user");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("Error not found");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    //const user= await User.findByIdAndDelete({_id:userId}) // above line is a simple way to write
    res.send("User deleted Successfully");
  } catch {
    res.status(404).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    //const user = await User.findByIdAndUpdate( userId , data, {returnDocument: "after",});
    const allowedUpdates = ["photoURL", "age", "skills", "about", "gender"];
    const isUpdatedAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdatedAllowed) {
      throw new Error("Update is restricted");
    }
    if (data.skills.length > 10) {
      throw new Error("Skills shouldn't be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
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
