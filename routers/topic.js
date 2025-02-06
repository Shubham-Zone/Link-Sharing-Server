const express = require("express");
const router = express();
const {createTopic, fetchTopic, fetchTopicUsers,
    fetchUserTopics, subscribeTopic, unSubscribeTopic,
    getTopics, getSubscribedTopics, deleteTopic,
    getSubscriptionsCount, updateTopic} = require("../controllers/topic");

router.get("/topic/:topicId", fetchTopic);

router.get("/users/:topicId", fetchTopicUsers);

router.get("/topics/:userId", fetchUserTopics);

router.post('/create-topic', createTopic);

router.post('/subscribe', subscribeTopic);

router.delete('/unsubscribe', unSubscribeTopic);

router.delete('/delete-topic', deleteTopic);

router.get('/topics', getTopics);

router.get('/subscribed-topics', getSubscribedTopics);

router.get('/subscription-count/:topic_id', getSubscriptionsCount);

router.put('/update-topic', updateTopic);

module.exports = router;