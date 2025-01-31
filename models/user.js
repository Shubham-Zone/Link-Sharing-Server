const mongoose = require("mongoose");

const user = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    userName: String,
    password: String,
    profilePhoto: Buffer,
});

module.exports = mongoose.model("users", user);
