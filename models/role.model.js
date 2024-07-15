const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const rolesSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    permissions: { type: Array, default: [] },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
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

module.exports = mongoose.model("Roles", rolesSchema, "roles");
