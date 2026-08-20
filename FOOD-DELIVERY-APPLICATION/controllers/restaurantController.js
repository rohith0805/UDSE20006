const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");


// All restaurants
const getRestaurants = async (req, res, next) => {

    try {

        const restaurants =
            await Restaurant.find()
                .sort({ rating: -1 });

        res.render("restaurants", {
            restaurants
        });

    } catch (error) {

        next(error);
    }
};


// Restaurant details
const getRestaurantDetails = async (
    req,
    res,
    next
) => {

    try {

        const restaurant =
            await Restaurant.findById(
                req.params.id
            );

        if (!restaurant) {

            return res.status(404).send(
                "Restaurant not found"
            );
        }

        const foods =
            await Food.find({
                restaurant: restaurant._id
            });

        res.render(
            "restaurantDetails",
            {
                restaurant,
                foods
            }
        );

    } catch (error) {

        next(error);
    }
};


module.exports = {
    getRestaurants,
    getRestaurantDetails
};