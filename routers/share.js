const express = require("express");
const router = express.Router();
const { shareLink, shareDocument } = require("../controllers/share");

router.post('/share-document', shareDocument);

router.post('/share-link', shareLink);

module.exports = router;
