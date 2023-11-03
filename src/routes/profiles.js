const express = require("express"),
  router = express.Router(),
  profileControllers = require("../controllers/profilesControllers"),
  multer = require("../middlewares/multer"),
  multerLib = require("multer")();

router.get("/readProfiles", profileControllers.getProfiles);
router.put(
  "/update/:id",
  multer.imageProfiles.single("image"),
  profileControllers.updateProfiles
);
router.put(
  "/update-profiles-with-imagekit/:id",
  multerLib.single("image"),
  profileControllers.updateProfilesWithImageKit
);
router.delete("/delete-profile/:id", profileControllers.deleteProfile);

module.exports = router;
