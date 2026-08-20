const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const {
    createOrder,
    getOrders
} = require("../controllers/orderController");


// Protected
router.post(
    "/",
    auth,
    createOrder
);


// Protected
router.get(
    "/",
    auth,
    getOrders
);


module.exports = router;