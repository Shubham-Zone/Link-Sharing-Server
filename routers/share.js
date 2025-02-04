const express = require("express");
const router = express.Router();
const { createTopic, shareLink, shareDocument,
    subscribeTopic, unSubscribeTopic, getTopics,
    getSubscribedTopics, getUser, getSubscriptionsCount,
    deleteTopic, updateTopic, createPost, getPosts } = require("../controllers/share");

router.post('/create-topic', createTopic);

router.post('/create-post', createPost);

router.get('/posts/:topicId', getPosts);

router.post('/subscribe', subscribeTopic);

router.delete('/unsubscribe', unSubscribeTopic);

router.delete('/delete-topic', deleteTopic);

router.get('/topics', getTopics);

router.get('/subscribed-topics', getSubscribedTopics);

router.get('/subscription-count/:topic_id', getSubscriptionsCount)

router.post('/share-document', shareDocument);

router.post('/share-link', shareLink);

router.get('/user', getUser);

router.put('/update-topic', updateTopic);

module.exports = router;


