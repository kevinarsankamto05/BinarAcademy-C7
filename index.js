const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  cors = require("cors"),
  router = require("./src/routes/index");

require("dotenv").config();

app.use(express.json({ strict: false }));
app.use(cors());
app.use("/images-profiles", express.static("public/images/profiles"));
app.use("/images-movies", express.static("public/images/movies"));
app.use("/api/v1", router);

// Handle 404 route
app.get("*", (req, res) => {
  return res.status(404).json({
    error: "End point not found",
  });
});

app.listen(port, () => {
  console.log(`Server is runing at PORT ${port}`);
});
