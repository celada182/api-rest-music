const Song = require("../models/song");

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

module.exports = {
    save,
    find
}