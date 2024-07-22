const mongoose = require("mongoose");
const generate = require("../helpers/generate");

// Schema
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, max: 50 },
        password: { type: String, required: true, min: 4 },
        tokenUser: {
            type: String,
            unique: true,
            default: generate.generateRandomString(20),
        },
        phone: String,
        avatar: String,
        status: {
            type: String,
            default: "active",
        },
        deleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Users", userSchema, "users");
