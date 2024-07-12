const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const rolesSchema = new Schema(
    {
        title: { type: String, required: true },
        description: String,
        permissions: { type: Array, default: [] },
        deleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Roles", rolesSchema, "roles");
