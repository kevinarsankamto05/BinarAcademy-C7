const express = require("express"),
  router = express.Router(),
  authControllers = require("../controllers/authControllers"),
  multer = require("../middlewares/multer"),
  validate = require("../middlewares/validate"),
  checkToken = require("../middlewares/checkToken"),
  schema = require("../validatorSchemas/authValidatorSchema"),
  multerLib = require("multer")();

router.post(
  "/register",
  multer.imageProfiles.single("image"),
  validate(schema.registerValidator),
  authControllers.register
);
router.post(
  "/register-with-imageKit",
  multerLib.single("image"),
  validate(schema.registerValidator),
  authControllers.registerWithImageKit
);
router.post("/login", validate(schema.loginValidator), authControllers.login);
router.get("/read-by-token", checkToken, authControllers.getUsers);
router.post(
  "/change-password",
  checkToken,
  validate(schema.changePasswordValidator),
  authControllers.changePassword
);

module.exports = router;
