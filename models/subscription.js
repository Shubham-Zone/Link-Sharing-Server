const mongoose = require("mongoose");

const subscription = new mongoose.Schema({
    topic_id: String,
    topic: String,
    user: String,
    seriousness: String,
    dateCreated: Date
});

module.exports = mongoose.model("Subscriptions", subscription);