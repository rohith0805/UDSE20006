const Food = require("../models/Food");

const getFoods = async (req, res, next) => {

    try {

        const foods =
            await Food.find()
                .populate("restaurant");

        res.json({
            success: true,
            foods
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {
    getFoods
};