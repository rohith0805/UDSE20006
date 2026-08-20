const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        rating: {
            type: Number,
            default: 4.0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Restaurant",
    restaurantSchema
);