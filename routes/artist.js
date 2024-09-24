const express = require("express");
const auth = require("../middlewares/auth");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/artists/");
    },
    filename: (req, file, cb) => {
        cb(null, "artist-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });
const router = express.Router();
const controller = require("../controllers/artist");
router.post("/save", auth.auth, controller.save);
router.get("/profile/:id", auth.auth, controller.profile);
router.get("/list", auth.auth, controller.list);
router.put("/update/:id", auth.auth, controller.update);
router.delete("/remove/:id", auth.auth, controller.remove);
router.post("/profile/:id/upload", [auth.auth, uploads.single("image")], controller.upload);
router.get("/image/:file", controller.image);
module.exports = router;