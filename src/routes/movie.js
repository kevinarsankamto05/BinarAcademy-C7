const express = require("express"),
  router = express.Router(),
  movieControllers = require("../controllers/movieControllers"),
  multer = require("../middlewares/multer"),
  multerLib = require("multer")();

router.post(
  "/create-movies",
  multer.imageMovies.single("images"),
  movieControllers.createMovie
);
router.post(
  "/create-movies-with-imageKit",
  multerLib.single("images"),
  movieControllers.createMovieWithImageKit
);
router.get("/read-all-movies", movieControllers.getMovie);
router.put(
  "/update-movies/:id",
  multer.imageMovies.single("images"),
  movieControllers.updateMovie
);

router.put(
  "/update-movies-with-imageKit/:id",
  multerLib.single("images"),
  movieControllers.createMovieWithImageKit
);
router.delete("/delete-movies/:id", movieControllers.deleteMovie);

module.exports = router;
