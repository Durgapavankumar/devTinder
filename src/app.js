const express = require("express");

const app = express();

// app.use("/", (req, res) => {
//   res.send("Hello from server");
// });
app.use(
  "/route",
  (req, res, next) => {
    console.log("User 1");
    next();
  },
  (req, res) => {
    console.log("user 2");
    res.send("Hiiiii");
  }
);

app.get("/user/:username/:name/:password", (req, res) => {
  //logic for get
  console.log(req.params);
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
