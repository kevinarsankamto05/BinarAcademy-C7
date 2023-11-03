const express = require("express"),
  router = express.Router(),
  authRoute = require("./auth"),
  authAddress = require("./address"),
  authProfiles = require("./profiles"),
  authMovies = require("./movie");

router.use("/auth", authRoute);
router.use("/address", authAddress);
router.use("/profiles", authProfiles);
router.use("/movies", authMovies);

module.exports = router;
