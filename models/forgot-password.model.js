const mongoose = require("mongoose");
const generate = require("../helpers/generate");

// Schema
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Forgot-password",
    forgotPasswordSchema,
    "forgot-password"
);
