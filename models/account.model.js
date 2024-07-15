const mongoose = require("mongoose");
const generate = require("../helpers/generate");

// Schema
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, max: 50 },
    password: { type: String, required: true, min: 4 },
    token: {
        type: String,
        unique: true,
        default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: { type: Boolean, default: false },
    createdBy: {
        account_id: String,
        createdAt: { type: Date, default: new Date() },
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date,
        },
    ],
    deletedBy: {
        account_id: String,
        deletedAt: Date,
    },
});

module.exports = mongoose.model("Accounts", accountSchema, "accounts");
