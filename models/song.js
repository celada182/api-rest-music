const { Schema, model } = require("mongoose");
const songSchema = Schema({
    artist: {
        type: Schema.ObjectId,
        ref: "Artist",
        required: true
    },
    album: {
        type: Schema.ObjectId,
        ref: "Album",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    track: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    file: {
        type: String,
        default: "default.mp3"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Song", songSchema, "songs");