const express = require("express");

const app = express();

// app.use("/", (req, res) => {
//   res.send("Hello from server");
// });

app.get("/user", (req, res) => {
  //logic for get
  res.send("Get from the server");
});
app.post("/user", (req, res) => {
  res.send("Post from the server (updated");
});

// app.use("/home", (req, res) => {
//   res.send("That' how different requests are handled properly");
// });
// app.use("/test", (req, res) => {
//   res.send("Hello from testtttt");
// });

app.listen(3000, () => {
  console.log("Server is running successfully");
});
