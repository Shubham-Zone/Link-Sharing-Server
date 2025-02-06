const mongoose = require("mongoose");

const ReadPostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
});

module.exports = mongoose.model("ReadPost", ReadPostSchema);
