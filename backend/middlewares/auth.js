// auth is a middleware to authenticate users using JWT
mongoose = require("mongoose");

// AUTH?
// const jwt = require("jsonwebtoken"); //probably
// const authMiddleware = require("../middleware/auth");


// authentication 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Server error" });
});