const express = require("express");
const router = express.Router();
const controller = require("../controllers/artist");
router.get("/id", controller.test);
module.exports = router;