const express = require("express");

const app = express();

const User = require("./models/user");

const { connectDb } = require("./config/database");

app.post("/signup", async (req, res) => {
  //creating the instance of new user
  const user = new User({
    firstName: "salaar",
    lastName: "Devaratha",
    emailId: "salaar@gmail.com",
    age: 35,
    password: "Salaar123",
  });
  try {
    await user.save();
    res.send("New User is created successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
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
