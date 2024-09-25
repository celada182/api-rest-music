const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const controller = require("../controllers/song");
router.post("/save", auth.auth, controller.save);
router.get("/find/:id", auth.auth, controller.find);
module.exports = router;