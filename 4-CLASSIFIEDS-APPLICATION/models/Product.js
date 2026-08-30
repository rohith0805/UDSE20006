const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Mobiles",
                "Laptops",
                "Electronics",
                "Vehicles",
                "Furniture",
                "Books",
                "Fashion",
                "Other"
            ]
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: "https://via.placeholder.com/400x250?text=No+Image"
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);