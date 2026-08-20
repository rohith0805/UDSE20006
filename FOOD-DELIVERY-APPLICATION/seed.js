require("dotenv").config();

const mongoose = require("mongoose");

const Restaurant =
    require("./models/Restaurant");

const Food =
    require("./models/Food");


const seedDatabase = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected"
        );


        await Food.deleteMany({});

        await Restaurant.deleteMany({});


        const restaurants =
            await Restaurant.insertMany([

                {
                    name: "Spice Garden",

                    description:
                        "Authentic Indian cuisine and delicious biryani.",

                    location:
                        "Guntur",

                    image:
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",

                    rating: 4.5
                },


                {
                    name: "Pizza Palace",

                    description:
                        "Fresh and delicious pizzas made with quality ingredients.",

                    location:
                        "Vijayawada",

                    image:
                        "https://images.unsplash.com/photo-1513104890138-7c749659a591",

                    rating: 4.3
                },


                {
                    name: "Burger House",

                    description:
                        "Juicy burgers, crispy fries and refreshing drinks.",

                    location:
                        "Guntur",

                    image:
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",

                    rating: 4.4
                },


                {
                    name:
                        "South Indian Kitchen",

                    description:
                        "Traditional South Indian breakfast and meals.",

                    location:
                        "Amaravati",

                    image:
                        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",

                    rating: 4.6
                }

            ]);


        await Food.insertMany([

            {
                name:
                    "Chicken Biryani",

                description:
                    "Hyderabadi style chicken biryani",

                price:
                    220,

                image:
                    "https://images.unsplash.com/photo-1563379091339-03246963d96c",

                restaurant:
                    restaurants[0]._id
            },


            {
                name:
                    "Paneer Biryani",

                description:
                    "Delicious paneer biryani",

                price:
                    180,

                image:
                    "https://images.unsplash.com/photo-1596797038530-2c107229654b",

                restaurant:
                    restaurants[0]._id
            },


            {
                name:
                    "Margherita Pizza",

                description:
                    "Classic cheese and tomato pizza",

                price:
                    250,

                image:
                    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",

                restaurant:
                    restaurants[1]._id
            },


            {
                name:
                    "Chicken Pizza",

                description:
                    "Loaded chicken pizza",

                price:
                    320,

                image:
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",

                restaurant:
                    restaurants[1]._id
            },


            {
                name:
                    "Cheese Burger",

                description:
                    "Classic cheese burger",

                price:
                    160,

                image:
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",

                restaurant:
                    restaurants[2]._id
            },


            {
                name:
                    "Chicken Burger",

                description:
                    "Crispy chicken burger",

                price:
                    190,

                image:
                    "https://images.unsplash.com/photo-1571091718767-18b5b1457add",

                restaurant:
                    restaurants[2]._id
            },


            {
                name:
                    "Masala Dosa",

                description:
                    "Crispy dosa with potato masala",

                price:
                    80,

                image:
                    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",

                restaurant:
                    restaurants[3]._id
            },


            {
                name:
                    "Idli Sambar",

                description:
                    "Soft idli served with hot sambar",

                price:
                    60,

                image:
                    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",

                restaurant:
                    restaurants[3]._id
            }

        ]);


        console.log(
            "Restaurants and food inserted successfully"
        );


        await mongoose.connection.close();

        console.log(
            "Database connection closed"
        );


    } catch (error) {

        console.error(
            "Seed error:",
            error.message
        );

        process.exit(1);
    }
};


seedDatabase();