const express = require("express");
const auth = require("../middlewares/auth");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/albums/");
    },
    filename: (req, file, cb) => {
        cb(null, "album-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });
const router = express.Router();
const controller = require("../controllers/album");
router.post("/save", auth.auth, controller.save);
router.get("/find/:id", auth.auth, controller.find);
router.get("/artist/:id", auth.auth, controller.albums);
router.post("/profile/:id/upload", [auth.auth, uploads.single("image")], controller.upload);
router.get("/image/:file", controller.image);
module.exports = router;