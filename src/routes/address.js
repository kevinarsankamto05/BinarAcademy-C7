const express = require("express");
const router = express.Router();
const addressControllers = require("../controllers/addressControllers");

router.post("/input", addressControllers.createAddress);
router.get("/read-all-address", addressControllers.getAddress);
router.put("/update-address/:id", addressControllers.updateAddress);
router.delete("/delete-address/:id", addressControllers.deleteAddress);

module.exports = router;
