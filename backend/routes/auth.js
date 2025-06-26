const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign-up route
router.post("/signup", async (req, res) => {
    console.log("📩 Datos recibidos en signup:", req.body);
    try{
 const { email, password } = req.body;

 // Validate input
    if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
    }
   
     // Verify is the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User is already registered" });
    }

   // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract username from email
    const username = email.split('@')[0];

    // save user to the database
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "user registered successfully", username });
    }
    catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post('/login', async (req, res) => {
    console.log("🔍 Datos recibidos en login:", req.body);
    console.log("🔑 JWT_SECRET existe:", !!process.env.JWT_SECRET);
    try{
    const { username, password } = req.body;

       // Validate
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }
     // Search for the user
       const user = await User.findOne({ 
            $or: [
                { username: username.toLowerCase().trim() },
                { email: username.toLowerCase().trim() }
            ]
        });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

     // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect Password' });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.json({ message: 'Login exitoso', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;