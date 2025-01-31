const express = require("express");
const router = express.Router();
const {createTopic, shareLink, shareDocument, subscribeTopic, getTopics, getSubscribedTopics} = require("../controllers/share");

router.post('/create-topic', createTopic);

router.post('/subscribe', subscribeTopic);

router.get('/topics', getTopics);

router.get('/subscribed-topics', getSubscribedTopics);

router.post('/share-document', shareDocument);

router.post('/share-link', shareLink);

module.exports = router;


