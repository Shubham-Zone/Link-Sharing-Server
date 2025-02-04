const mongoose = require("mongoose");

const post = new mongoose.Schema({
    topicId: String,
    content: String,
    createrName: String,
    createrUsername: String,
    topicName: String
});

module.exports = mongoose.model('posts', post);