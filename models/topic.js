const mongoose = require("mongoose");

const topic = new mongoose.Schema({
    name: String,
    createdBy: String,
    dateCreated: Date,
    lastUpdated: Date,
    visibility: String
});

module.exports = mongoose.model("Topics", topic);