const express = require("express");
const router = express.Router();
const {createTopic, shareLink, shareDocument, subscribeTopic, unSubscribeTopic, getTopics, getSubscribedTopics, getUser} = require("../controllers/share");

router.post('/create-topic', createTopic);

router.post('/subscribe', subscribeTopic);

router.delete('/unsubscribe', unSubscribeTopic);

router.get('/topics', getTopics);

router.get('/subscribed-topics', getSubscribedTopics);

router.post('/share-document', shareDocument);

router.post('/share-link', shareLink);

router.get('/user', getUser);

module.exports = router;


