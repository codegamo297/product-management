const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const cartsSchema = new Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number,
            },
        ],
        expireAt: {
            type: Date,
            required: true,
            index: { expires: "0" },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Carts", cartsSchema, "carts");
