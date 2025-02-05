const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, userName, password } = req.body;
        const profilePhoto = req.file ? req.file.buffer.toString("base64") : null;

        if (!firstName || !lastName || !email || !userName || !password) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        const alreadyExisted = await User.findOne({ email });
        if (alreadyExisted) {
            return res.status(409).json({ msg: "User already registered." });
        }

        const uniqueUserName = await User.findOne({ userName });
        if (uniqueUserName) {
            return res.status(409).json({ msg: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = new User({
            firstName,
            lastName,
            email,
            userName,
            password: hashedPassword,
            profilePhoto,
        });

        await newUser.save();

        res.status(201).json({ msg: "User registered successfully." });
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(401).json({ msg: "userName or password not found." });
        }
        console.log(userName);
        const user = await User.findOne({ email: userName });
        if (!user) {
            return res.status(400).json({ msg: "User not exist" });
        }
        console.log(password, user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }
        const token = jwt.sign({ id: user._id }, "drapcode");
        return res.status(200).json({ token: token, ...user._doc });
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
};

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User doesn't exist" });

        const secret = process.env.JWT + user.password;
        const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });

        const resetURL = `http://localhost:5173/resetpassword?id=${user._id}&token=${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: 'ufyl ocze qipz yaji',
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetURL}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ msg: error });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ msg: 'Password reset link sent successfully' });
            }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Something went wrong' });
    }
};

exports.resetPassword = async (req, res, next) => {
    const { id, token, password } = req.body;

    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({ msg: "User not exists!" });
        }

        const secret = process.env.JWT + user.password;

        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );

        await user.save();

        res.status(200).json({ msg: 'Password has been reset' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
};
