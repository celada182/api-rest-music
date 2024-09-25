const Album = require("../models/album");
const fs = require("fs");
const path = require("path");

const save = (req, res) => {
    let params = req.body;
    if (!params.artist || !params.title || !params.year) {
        return res.status(400).send({
            status: "error",
            message: "Missing required fields"
        })
    }
    let album = new Album(params);
    album.save().then(albumStored => {
        if (!albumStored) {
            return res.status(500).send({
                status: "error",
                message: "Error saving album"
            })
        }
        return res.status(200)
            .send({ status: "success", message: "Album saved", album: albumStored.name });
    });
};

const find = (req, res) => {
    const id = req.params.id;
    Album.findById(id).populate("artist").then(album => {
        if (!album) {
            return res.status(404).send({
                status: "error",
                message: "Album not found"
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Album found",
            artist: album
        });
    }).catch(error => {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error fiding album"
        });
    });
};

const albums = (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(404).send({
            status: "error",
            message: "Artist not found"
        });
    }
    Album.find({ artist: id }).populate("artist").then(albums => {
        if (!albums) {
            return res.status(404).send({
                status: "error",
                message: "Albums not found"
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Albums found",
            albums
        });
    }).catch(error => {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error fiding albums"
        });
    });
};

const upload = async (req, res) => {
    const id = req.params.id;
    if (!req.file) {
        return res.status(400).send({
            status: "error",
            message: "Image not found"
        });
    }
    let image = req.file.originalname;
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];

    if (extension !== "png" && extension !== "jpg" && extension !== "jpeg" && extension !== "gif") {
        const filePath = req.file.path;
        fs.unlinkSync(filePath);
        return res.status(400).send({
            status: "error",
            message: "Image invalid extension"
        });
    }

    try {
        const albumUpdated = await Album.findByIdAndUpdate({ _id: id }, { image: req.file.filename }, { new: true });
        if (!albumUpdated) {
            console.error("Error updating image");
            return res.status(400).send({
                status: "error",
                message: "Error updating image"
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Album picture uploaded",
            file: req.file
        });

    } catch (error) {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error uploading image"
        });
    }
}

const image = (req, res) => {
    const file = req.params.file;
    const filePath = "./uploads/albums/" + file;
    fs.stat(filePath, (error, exists) => {
        if (error || !exists) {
            return res.status(404).send({
                status: "error",
                message: "Image not found"
            });
        }
    });
    return res.sendFile(path.resolve(filePath));
}

module.exports = {
    save,
    find,
    albums,
    upload,
    image
}