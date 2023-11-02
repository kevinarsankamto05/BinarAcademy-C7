const express = require("express"),
  router = express.Router(),
  authRoute = require("./auth");
// // authAddress = require("./address"),
// // authProfile = require("./profiles");

router.use("/auth", authRoute);
// router.use("/address", authAddress);
// router.use("/profiles", authProfile);

module.exports = router;
