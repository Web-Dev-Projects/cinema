const mongoose = require("mongoose");

module.exports = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        password: String,
        firstname: String,
        lastname: String,
        email: String,
        birthdate: Date,
        admin: Boolean
    })
);
