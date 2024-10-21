const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/uservalidation");
const { profile } = require("console");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request Enter properly !");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, Successfully updated`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

profileRouter.patch("/profile/changepassword", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
  } catch (err) {}
});

module.exports = profileRouter;