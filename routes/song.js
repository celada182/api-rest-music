const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const controller = require("../controllers/song");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/songs/");
    },
    filename: (req, file, cb) => {
        cb(null, "song-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });
router.post("/save", auth.auth, controller.save);
router.get("/find/:id", auth.auth, controller.find);
router.get("/album/:id", auth.auth, controller.album);
router.post("/upload/:id", [auth.auth, uploads.single("audio")], controller.upload);
router.get("/audio/:file", controller.audio);
module.exports = router;