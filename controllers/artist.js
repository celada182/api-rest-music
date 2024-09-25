const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

const save = (req, res) => {
    // Get data
    let params = req.body;
    // Required data
    if (!params.name) {
        return res.status(400).send({
            status: "error",
            message: "Missing required fields"
        })
    }
    let artist = new Artist(params);
    // Save artist
    artist.save().then(artistStored => {
        if (!artistStored) {
            return res.status(500).send({
                status: "error",
                message: "Error saving artist"
            })
        }
        return res.status(200)
            .send({ status: "success", message: "Artist saved", artists: artistStored.name });
    });
}

const profile = (req, res) => {
    const id = req.params.id;
    Artist.findById(id).then(artist => {
        if (!artist) {
            return res.status(404).send({
                status: "error",
                message: "Artist not found"
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Artist profile found",
            artist
        });
    }).catch(error => {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error fiding artist"
        });
    });
};

const list = (req, res) => {
    let page = 1;
    let items = 5;
    if (req.query.page) {
        page = req.query.page;
    };
    if (req.query.items) {
        items = req.query.items;
    };

    Artist.find().sort("name")
        .paginate(page, items)
        .then(artists => {
            return res.status(200).send({
                status: "success",
                page,
                artists
            });
        })
        .catch(error => {
            console.log(error);
            return res.status(400).send({
                status: "error",
                message: "Error fiding artist"
            });
        });
};

const update = (req, res) => {
    const id = req.params.id;
    const artistToUpdate = req.body;
    Artist.findById(id).then(async artist => {
        if (!artist) {
            return res.status(404).send({
                status: "error",
                message: "Artists not found"
            });
        }
        try {
            const artistUpdated = await Artist.findByIdAndUpdate({ _id: id }, artistToUpdate, { new: true });
            if (!artistUpdated) throw new Error("Artist cannot be updated");
            return res.status(200).send({
                status: "success",
                message: "Artist updated",
                artist: artistUpdated
            });
        } catch (error) {
            console.error(error);
            return res.status(400).send({
                status: "error",
                message: "Error updating artist"
            });
        }
    }).catch(error => {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error fiding artist"
        });
    });
};

const remove = async (req, res) => {
    const id = req.params.id;
    try {
        const artistRemoved = await Artist.findByIdAndDelete(id);
        const albumsRemoved = await Album.find({ artist: id }).remove();
        // Multiple albums?
        const songsRemoved = await Song.find({ album: albumsRemoved._id }).remove();
        return res.status(200).send({
            status: "success",
            artist: artistRemoved,
            albums: albumsRemoved,
            songs: songsRemoved
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error removing artist"
        });
    }
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
        const artistUpdated = await Artist.findByIdAndUpdate({ _id: id }, { image: req.file.filename }, { new: true });
        if (!artistUpdated) {
            console.error("Error updating image");
            return res.status(400).send({
                status: "error",
                message: "Error updating image"
            });
        }
        return res.status(200).send({
            status: "success",
            message: "Artist picture uploaded",
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
    const filePath = "./uploads/artists/" + file;
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
    profile,
    list,
    update,
    remove,
    upload,
    image
}