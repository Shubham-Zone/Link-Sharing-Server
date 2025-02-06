const ReadPost = require("../models/readPost");
const Post = require("../models/post");

exports.ReadPost = async (req, res) => {
    try {
        const { userId, postId } = req.body;
        if (!userId || !postId) {
            return res.status(400).json({ msg: "userId and postId is required." });
        }
        const existing = await ReadPost.findOne({ userId, postId });
        if (existing) {
            return res.status(400).json({ msg: "Post already marked as read" });
        }
        await ReadPost.create({ userId, postId });
        res.status(200).json({ message: "Post marked as read" });
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.getUnreadPosts = async (req, res) => {
    const userId = req.params.userId;
    console.log('Req comes to fetch unread posts', req.params);

    try {
        // Get all post IDs marked as read by the user
        const readPosts = await ReadPost.find({ userId }).select("postId");
        console.log("Readposts are", readPosts);
        // If no read posts exist, return all posts
        if (!readPosts || readPosts.length === 0) {
            const allPosts = await Post.find(); 
            return res.status(200).json(allPosts);
        }

        const readPostIds = readPosts.map((p) => p.postId);

        // Fetch unread posts 
        const unreadPosts = await Post.find({ _id: { $nin: readPostIds } });

        res.status(200).json(unreadPosts);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { topicId, content, createrName, createrUsername, topicName } = req.body;
        if (!topicId || !content || !createrName || !createrUsername || !topicName) {
            return res.status(400).json({ msg: 'All fields are required' });
        }
        const newPost = new Post({ topicId, content, createrName, createrUsername, topicName });
        newPost.save();
        res.status(200).json({ msg: 'Post created successfully', post: newPost });
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const { topicId } = req.params;
        if (!topicId) {
            return res.status(400).json({ msg: 'Topic id is required' });
        }
        const posts = await Post.find({ topicId });
        if (posts.length === 0) {
            return res.status(402).json({ msg: 'No posts found' });
        }
        res.status(200).json(posts);
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.getPublicPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        if (posts.length === 0) {
            return res.status(402).json({ msg: 'No posts found' });
        }
        res.status(200).json(posts);
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};
