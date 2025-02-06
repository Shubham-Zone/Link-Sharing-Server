const express = require("express");
const router = express.Router();
const {ReadPost, getUnreadPosts} = require("../controllers/post");
const {createPost, getPosts, getPublicPosts} = require("../controllers/post");

router.post("/mark-read", ReadPost);

router.get("/unread-posts/:userId", getUnreadPosts);

router.post('/create-post', createPost);

router.get('/posts/:topicId', getPosts);

router.get('/public-posts', getPublicPosts);

module.exports = router;