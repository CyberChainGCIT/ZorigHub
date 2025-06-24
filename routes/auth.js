// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

// Load the User schema from turfmasterDB
const User = mongoose.connection.useDb('turfmasterDB').model('User', require('../models/user').schema);

// Create an Express router instance
const router = express.Router();

// Retrieve JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// ==============================
// 🚀 Register Endpoint
// ==============================
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, photo, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ error: "User already exists" });

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            photo,
            role: role || "user"  // Default role is 'user'
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==============================
// 🔐 Login Endpoint
// ==============================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "User not found" });

        // Validate password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            return res.status(401).json({ error: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res
            .cookie('token', token, {
                // httpOnly: false,
                // httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set true in production (HTTPS)
                // sameSite: 'strict',
            })
            .json({ message: 'Login successful' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export router
module.exports = router;
