const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

// Schema
const Schema = mongoose.Schema;

// Slug
mongoose.plugin(slug);

const productCategorySchema = new Schema({
    title: { type: String, required: true },
    parent_id: { type: String, default: "" },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title", unique: true },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
    createdBy: {
        account_id: String,
        createdAt: { type: Date, default: new Date() },
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: { type: Date },
        },
    ],
    deletedBy: {
        account_id: String,
        deletedAt: { type: Date },
    },
});

module.exports = mongoose.model(
    "ProductCategory",
    productCategorySchema,
    "products-category"
);
