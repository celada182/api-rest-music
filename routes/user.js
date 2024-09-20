const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const controller = require("../controllers/user");
router.get("/id", controller.test);
router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/profile/:id", auth.auth, controller.profile);
module.exports = router;