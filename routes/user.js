const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
router.get("/id", controller.test);
router.post("/signup", controller.signup)
module.exports = router;