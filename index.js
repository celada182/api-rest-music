// DB
const connection = require("./database/connection");
// Deps
const express = require("express");
const cors = require("cors");
// Welcome
console.log("API REST Node for the music app started");
// DB connection
connection();
// Node server
const app = express();
const port = 3911;
// CORS configuration
app.use(cors());
// Map data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
const userRoutes = require("./routes/user");
const artistRoutes = require("./routes/artist");
const albumRoutes = require("./routes/album");
const songRoutes = require("./routes/song");
app.use("/api/user", userRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/song", songRoutes);
// Test route
app.get("/test", (req, res) => {
    return res.status(200).send({ "message": "Test OK" });
});
// Server listening
app.listen(port, () => {
    console.log("Server started using port: ", port);
});