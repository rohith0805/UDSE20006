require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");

const User = require("./models/User");
const Product = require("./models/Product");

const seedDatabase = async () => {
    try {
        await connectDB();

        await User.deleteMany({});
        await Product.deleteMany({});

        const password = await bcrypt.hash("123456", 10);

        const user = await User.create({
            name: "Demo Seller",
            email: "demo@example.com",
            password
        });

        await Product.insertMany([
            {
                title: "iPhone 13",
                description:
                    "iPhone 13 in excellent condition. Used carefully and works perfectly.",
                price: 35000,
                category: "Mobiles",
                location: "Guntur",
                image:
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
                seller: user._id
            },

            {
                title: "Dell Laptop",
                description:
                    "Dell laptop suitable for students and office work.",
                price: 28000,
                category: "Laptops",
                location: "Vijayawada",
                image:
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
                seller: user._id
            },

            {
                title: "Study Table",
                description:
                    "Wooden study table in good condition.",
                price: 3500,
                category: "Furniture",
                location: "Guntur",
                image:
                    "https://images.unsplash.com/photo-1533090161767-e6ffed986c88",
                seller: user._id
            },

            {
                title: "Honda Bike",
                description:
                    "Well maintained used bike. Contact seller for details.",
                price: 65000,
                category: "Vehicles",
                location: "Tenali",
                image:
                    "https://images.unsplash.com/photo-1558981806-ec527fa84c39",
                seller: user._id
            }
        ]);

        console.log("Database seeded successfully.");

        console.log("");
        console.log("Demo Login:");
        console.log("Email: demo@example.com");
        console.log("Password: 123456");
        console.log("");

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedDatabase();