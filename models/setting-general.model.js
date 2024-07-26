const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const settingGeneralSchema = new Schema(
    {
        websiteName: String,
        logo: String,
        phone: String,
        email: String,
        address: String,
        copyright: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Settings-general",
    settingGeneralSchema,
    "settings-general"
);
