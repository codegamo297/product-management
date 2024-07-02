const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

// Schema
const Schema = mongoose.Schema;

// Slug
mongoose.plugin(slug);

const productSchema = new Schema(
    {
        title: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        slug: { type: String, slug: "title", unique: true },
        deleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema, "products");
