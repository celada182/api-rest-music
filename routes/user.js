const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const controller = require("../controllers/user");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/");
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

router.get("/id", controller.test);
router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/profile/:id", auth.auth, controller.profile);
router.put("/profile/:id", auth.auth, controller.update);
router.post("/profile/:id/upload", [auth.auth, uploads.single("image")], controller.upload);
router.get("/avatar/:file", controller.avatar);
module.exports = router;