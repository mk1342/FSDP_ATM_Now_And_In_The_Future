// Example model: models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    pin: String,
    balance: Number,
});

module.exports = mongoose.model("User", userSchema);
