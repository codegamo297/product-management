const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        title: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        deleted: Boolean,
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema, "products");
