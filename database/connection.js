const mongoose = require("mongoose");
const connection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/music");
        console.log("Connected succesfully to the DB music");
    } catch (error) {
        console.log(error);
        throw new Error("Error connecting to the database, make sure container is running");
    }
};

module.exports = connection;