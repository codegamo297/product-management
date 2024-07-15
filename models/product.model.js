const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

// Schema
const Schema = mongoose.Schema;

// Slug
mongoose.plugin(slug);

const productSchema = new Schema({
    title: { type: String, required: true },
    product_category_id: { type: String, default: "" },
    description: String,
    price: { type: Number, required: true },
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title", unique: true },
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

module.exports = mongoose.model("Product", productSchema, "products");
