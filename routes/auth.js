const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register User (Testing ke liye)
router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        
        // Return user role so frontend can handle redirection
        res.json({ message: "Login successful", role: user.role, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;