// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Signup route
router.get("/signup", (req, res) => {
    res.render("signup");
});

//Encrypts the password
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    req.session.userId = newUser._id;
    res.redirect("/");
});

// Login route
router.get("/login", (req, res) => {
    res.render("login");
});

//Encrypts the password a user has entered and compares it to the one in the database
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send("Invalid credentials");
    }

    req.session.userId = user._id;
    res.redirect("/");
});

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    next();
}

// Dashboard route 
router.get("/", requireAuth, (req, res) => {
    res.render("/", { username: req.session.userId });
});

module.exports = router;
//module.exports = { router, requireAuth };
