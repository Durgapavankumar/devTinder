const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello from server");
});

app.use("/home", (req, res) => {
  res.send("That' how different requests are handled properly");
});

app.listen(3000, () => {
  console.log("Server is running successfully");
});
