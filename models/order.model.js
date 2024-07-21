const mongoose = require("mongoose");
const generate = require("../helpers/generate");

// Schema
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        user_id: String,
        cart_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String,
        },
        products: [
            {
                product_id: String,
                price: Number,
                quantity: Number,
                discountPercentage: Number,
            },
        ],
        deleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema, "orders");
