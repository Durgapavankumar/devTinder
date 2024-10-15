const express = require("express");

const app = express();

const User = require("./models/user");

const { connectDb } = require("./config/database");
const { after } = require("node:test");

app.use(express.json());

app.post("/signup", async (req, res) => {
  //creating the instance of new user
  const user = new User(req.body);
  try {
    await user.save();
    res.send("New User is created successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    //const user = await User.findByIdAndUpdate( userId , data, {returnDocument: "after",});
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
