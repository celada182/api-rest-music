const Song = require("../models/song");
const fs = require("fs");
const path = require("path");

const save = (req, res) => {
    let params = req.body;
    if (!params.artist || !params.album || !params.title || !params.track || !params.duration) {
        return res.status(400).send({
            status: "error",
            message: "Missing required fields"
        })
    }
    let song = new Song(params);
    song.save().then(songStored => {
        if (!songStored) {
            return res.status(500).send({
                status: "error",
                message: "Error saving song"
            })
        }
        return res.status(200)
            .send({ status: "success", message: "Song saved", song: songStored.title });
    });
};

const find = (req, res) => {
    const id = req.params.id;
    Song.findById(id).populate("artist").populate("album").then(song => {
        if (!song) {
            return res.status(404).send({
                status: "error",
                message: "Song not found"
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Song found",
            artist: song
        });
    }).catch(error => {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error fiding song"
        });
    });
};

const album = (req, res) => {
    const id = req.params.id;
    Song.find({ album: id }).sort("track").then(songs => {
        if (!songs) {
            return res.status(404).send({
                status: "error",
                message: "Album songs not found"
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Album songs found",
            songs
        });
    }).catch(error => {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error fiding album songs"
        });
    });
};

const upload = async (req, res) => {
    const id = req.params.id;
    if (!req.file) {
        return res.status(400).send({
            status: "error",
            message: "File not found"
        });
    }
    let file = req.file.originalname;
    const imageSplit = file.split("\.");
    const extension = imageSplit[1];

    if (extension !== "mp3" && extension !== "ogg") {
        const filePath = req.file.path;
        fs.unlinkSync(filePath);
        return res.status(400).send({
            status: "error",
            message: "File invalid extension"
        });
    }

    try {
        const albumUpdated = await Song.findByIdAndUpdate({ _id: id }, { file: req.file.filename }, { new: true });
        if (!albumUpdated) {
            console.error("Error updating file");
            return res.status(400).send({
                status: "error",
                message: "Error updating file"
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Song file uploaded",
            file: req.file
        });

    } catch (error) {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error uploading file"
        });
    }
}

const audio = (req, res) => {
    const file = req.params.file;
    const filePath = "./uploads/songs/" + file;
    fs.stat(filePath, (error, exists) => {
        if (error || !exists) {
            return res.status(404).send({
                status: "error",
                message: "Audio not found"
            });
        }
    });
    return res.sendFile(path.resolve(filePath));
}

module.exports = {
    save,
    find,
    album,
    upload,
    audio
}