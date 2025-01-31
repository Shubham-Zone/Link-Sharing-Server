const express = require("express");
const router = express.Router();
const {register, login, requestPasswordReset, resetPassword} = require("../controllers/auth");
const multer  = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// Register user
router.post("/register", upload.single('profilePhoto'), register)

// Login user
router.post("/login", login)

// Route to request password reset
router.post('/requestPasswordReset', requestPasswordReset);

// Route to reset password
router.post('/resetPassword', resetPassword);

module.exports = router;