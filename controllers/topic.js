const Topic = require("../models/topic");
const Subscriptions = require("../models/subscription");
const mongoose = require("mongoose");

exports.fetchUserTopics = async (req, res) => {
    try {
        console.log("req comes", req.params);
        const {userId} = req.params;
        if(!userId) {
            return res.status(500).json({msg: "userId is required."});
        }
        const topics = await Topic.find({createdBy: userId});
        console.log(topics);
        if(!topics) {
            return res.status(402).json({msg: "Topics not found."});
        }
        res.status(200).json(topics);
    } catch(e) {
        return res.status(500).json({msg: e.message});
    }
};

exports.fetchTopic = async (req, res) => {
    try {
        console.log("req comes", req.params);
        const {topicId} = req.params;
        if(!topicId) {
            return res.status(500).json({msg: "topicId is required."});
        }
        const topic = await Topic.findOne({_id: topicId});
        console.log(topic);
        if(!topic) {
            return res.status(402).json({msg: "Topic not found."});
        }
        res.status(200).json(topic);
    } catch(e) {
        return res.status(500).json({msg: e.message});
    }
};

exports.fetchTopicUsers = async (req, res) => {
    console.log(`Req from ${req.url} ${req.params}`);
    try {
        const {topicId} = req.params;
        console.log("Topic id is", topicId);
        if(!topicId) {
            return res.status(500).json({msg: "topicId is required."});
        }
        const docs = await Subscriptions.find({topic_id: topicId});
        if(!docs) {
            return res.status(400).json({msg: 'No users found.'});
        }
        const users = docs.map((doc) => doc.user);
        console.log('Users of topic is', users);
        res.status(200).json(users);
    } catch(e) {
        return res.status(500).json({msg: e.message});
    }
};

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
        console.log(req.body);
        const { topic_id, topic, user, seriousness, dateCreated } = req.body;
        if (!topic_id || !topic || !user || !seriousness || !dateCreated) {
            return res.status(400).json({ msg: 'Please enter all the data' });
        }
        const alreadySubscribed = await Subscriptions.findOne({ topic_id, user });
        if (alreadySubscribed) {
            return res.status(500).json({ msg: 'Already subscribed' });
        }
        const subsciption = new Subscriptions({
            topic_id, topic, user, seriousness, dateCreated
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
        const { topic_id } = req.body;
        console.log('Request to unsubscribe ', req.body);
        if (!topic_id) {
            return res.status(400).json({ msg: 'Please enter the topic_id' });
        }
        const topicToDel = await Subscriptions.findOne({ topic_id: topic_id });
        if (!topicToDel) {
            return res.status(400).json({ msg: 'Topic not found.' });
        }
        await Subscriptions.deleteOne({ topic_id: topic_id })
            .then(() => {
                res.status(200).json({ msg: `${topic_id} unsubscribed successfully` });
            })
            .catch((e) => {
                console.log(e);
            })
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        const { topic_id } = req.body;

        if (!topic_id) {
            return res.status(400).json({ msg: 'Topic ID not provided' });
        }

        // Convert the topic_id to ObjectId
        const objectId = new mongoose.Types.ObjectId(topic_id);
        console.log(objectId);
        // Delete the topic by its _id
        const deletedTopic = await Topic.findByIdAndDelete(objectId);
        if (!deletedTopic) {
            return res.status(404).json({ msg: 'Topic not found' });
        }

        // Delete all related subscriptions using topic_id
        await Subscriptions.deleteMany({ topic_id: objectId });

        return res.status(200).json({ msg: 'Topic and related subscriptions deleted successfully' });
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.updateTopic = async (req, res) => {
    try {
        const { topicId, newName } = req.body;

        if (!topicId || !newName) {
            return res.status(400).json({ msg: "Topic ID and new name are required" });
        }

        // Step 1: Update the topic name in the topics collection
        const updatedTopic = await Topic.findByIdAndUpdate(
            topicId,
            { name: newName },
            { new: true }
        );

        if (!updatedTopic) {
            return res.status(404).json({ msg: "Topic not found" });
        }

        // Step 2: Update the topic name in the subscriptions collection
        await Subscriptions.updateMany(
            { topic_id: topicId },
            { $set: { topic: newName } }
        );

        // Step 3: Return the updated topic and success message
        return res.status(200).json({
            msg: "Topic and related subscriptions updated successfully",
            updatedTopic
        });

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

exports.getSubscriptionsCount = async (req, res) => {
    try {
        const { topic_id } = req.params;
        console.log('Topic id ', topic_id);
        console.log('Req params are', req.params);
        if (!topic_id) {
            return res.status(400).json({ msg: 'Topic id not found.' });
        }
        const count = await Subscriptions.countDocuments({ topic_id: topic_id });
        console.log('Count: ', count);
        res.status(200).json({ cnt: count });
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};