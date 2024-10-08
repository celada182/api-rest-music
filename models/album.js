const { Schema, model } = require("mongoose");
const albumSchema = Schema({
    artist: {
        type: Schema.ObjectId,
        ref: "Artist",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    year: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Album", albumSchema, "albums");