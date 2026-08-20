const Order = require("../models/Order");
const Food = require("../models/Food");


// Create order
const createOrder = async (req, res, next) => {

    try {

        const {
            items,
            address,
            phone
        } = req.body;

        if (!items || !Array.isArray(items)) {

            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        if (items.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        if (!address || !phone) {

            return res.status(400).json({
                success: false,
                message:
                    "Address and phone are required"
            });
        }

        const orderItems = [];

        let totalAmount = 0;

        for (const item of items) {

            const food =
                await Food.findById(item.id);

            if (!food) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Food item not found"
                });
            }

            const quantity =
                Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid quantity"
                });
            }

            const itemTotal =
                food.price * quantity;

            totalAmount += itemTotal;

            orderItems.push({
                food: food._id,
                name: food.name,
                price: food.price,
                quantity
            });
        }

        const order = await Order.create({
            user: req.session.user.id,
            items: orderItems,
            totalAmount,
            address,
            phone
        });

        res.json({
            success: true,
            message: "Order placed successfully",
            orderId: order._id
        });

    } catch (error) {

        next(error);
    }
};


// My orders
const getOrders = async (req, res, next) => {

    try {

        const orders =
            await Order.find({
                user: req.session.user.id
            })
            .populate("items.food")
            .sort({
                createdAt: -1
            });

        res.render("orders", {
            orders
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {
    createOrder,
    getOrders
};