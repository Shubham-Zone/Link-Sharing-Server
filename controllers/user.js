const User = require("../models/user");

exports.getUser = async (req, res) => {
    try {
        const { uuid } = req.headers;
        console.log(req.headers);
        if (!uuid) {
            return res.status(400).json({ msg: 'uuid not found' });
        }
        const user = await User.findOne({ uuid });
        res.status(201).json(user);
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};