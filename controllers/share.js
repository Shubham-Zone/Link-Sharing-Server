const Topic = require('../models/topic');
const Subscriptions = require("../models/subscription");
const User = require("../models/user");

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

exports.deleteTopic = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ msg: 'Name of the topic not found' });
        }
        await Topic.deleteOne({ name });
        await Subscriptions.deleteOne({ name });
        res.status(200).json({ msg: `Topic ${name} deleted successfully` });
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.subscribeTopic = async (req, res) => {
    try {
        console.log(req.body);
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

exports.unSubscribeTopic = async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) {
            return res.status(400).json({ msg: 'Please enter the topic' });
        }
        const topicToDel = await Subscriptions.findOne({topic});
        if(!topicToDel) {
            return res.status(400).json({msg: 'Topic not found.'});
        }
        await Subscriptions.deleteOne({topic})
        .then(() => {
            res.status(200).json({msg: `${topic} unsubscribed successfully`});
        })
        .catch((e) => {
            console.log(e);
        })
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.getTopics = async (req, res) => {
    try {
        const topics = await Topic.find({ "visibility": "Public" });
        if (!topics) {
            return res.status(400).json({ msg: 'No topics found' });
        }
        res.status(200).json(topics);
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.getSubscribedTopics = async (req, res) => {
    try {
        const { user } = req.headers;
        if (!user) {
            return res.status(400).json({ msg: "Username not found" });
        }

        const subscriptions = await Subscriptions.find({ user });
        if (!subscriptions.length) {
            return res.status(400).json({ msg: "No data found" });
        }

        // Fetch topics for each subscription
        const data = await Promise.all(
            subscriptions.map(async (subscription) => {
                console.log(subscription);
                const topicData = await Topic.findOne({ name: subscription.topic });
                console.log(topicData);
                return { ...subscription.toObject(), topicData };
            })
        );

        res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ msg: e.message });
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

exports.getUser = async (req, res) => {
    try {
        const { email } = req.headers;
        console.log(req.headers);
        if (!email) {
            return res.status(400).json({ msg: 'Email not found' });
        }
        const user = await User.findOne({ email });
        res.status(201).json(user);
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};