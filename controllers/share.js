const Topic = require('../models/topic');
const Subscriptions = require("../models/subscription");

exports.createTopic = async (req, res) => {
    try {
        const { name, createdBy, dateCreated, lastUpdated, visibility } = req.body;
        if (!name || !createdBy || !dateCreated || !lastUpdated || !visibility) {
            return res.status(400).json({ msg: 'Please enter all the details' });
        }
        const alreadyExist = await Topic.findOne({ name, createdBy });
        if (alreadyExist) {
            return res.status(500).json({ msg: 'Topic already exist' });
        }
        const topic = new Topic({
            name, createdBy, dateCreated, lastUpdated, visibility
        });
        await topic.save()
            .then(() => {
                res.status(200).json({ msg: 'Topic created successfully', topic: topic });
            })
            .catch((e) => {
                res.status(500).json({ msg: e.message });
            })
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.subscribeTopic = async (req, res) => {
    try {
        const { topic, user, seriousness, dateCreated } = req.body;
        if (!topic || !user || !seriousness || !dateCreated) {
            return res.status(400).json({ msg: 'Please enter all the data' });
        }
        const alreadySubscribed = await Subscriptions.findOne({ topic, user });
        if (alreadySubscribed) {
            return res.status(500).json({ msg: 'Already subscribed' });
        }
        const subsciption = new Subscriptions({
            topic, user, seriousness, dateCreated
        });
        await subsciption.save()
            .then(() => {
                res.status(200).json({ msg: 'Subscribed to topic successfully' });
            })
            .catch((e) => {
                res.status(500).json({ msg: e.message });
            })
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.getTopics = async (req, res) => {
    try {
        const topics = await Topic.find({"visibility": "Public"});
        if(!topics) {
            return res.status(400).json({msg: 'No topics found'});
        }
        res.status(200).json(topics);
    } catch(e) {
        return res.status(500).json({msg: e.message});
    } 
};

exports.getSubscribedTopics = async (req, res) => {
    try {
        const {user} = req.body;
        if(!user) {
            return res.status(400).json({msg: 'Username not found'});
        }
        const subsciptions = await Subscriptions.find({user});
        if(!subsciptions) {
            return res.status(400).json({msg: 'No data found'});
        }
        res.status(200).json(subsciptions);
    } catch (e) {
        return res.status(500).json({msg: e.message});
    }
};

exports.shareLink = async (req, res) => {
    try {

    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.shareDocument = async (req, res) => {
    try {

    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};
