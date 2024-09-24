const { Schema, model } = require("mongoose");
const artistSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Artist", artistSchema, "artists");