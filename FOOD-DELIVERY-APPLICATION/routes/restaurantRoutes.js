const express = require("express");

const router = express.Router();

const {
    getRestaurants,
    getRestaurantDetails
} = require("../controllers/restaurantController");


router.get(
    "/",
    getRestaurants
);


router.get(
    "/:id",
    getRestaurantDetails
);


module.exports = router;