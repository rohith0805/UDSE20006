const Product = require("../models/Product");

exports.home = async (req, res) => {
    try {
        const search = req.query.search || "";
        const category = req.query.category || "";

        const query = {};

        if (search) {
            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (category) {
            query.category = category;
        }

        const products = await Product.find(query)
            .populate("seller", "name email")
            .sort({ createdAt: -1 });

        res.render("home", {
            products,
            search,
            category,
            error: null
        });
    } catch (error) {
        console.error(error);

        res.render("home", {
            products: [],
            search: "",
            category: "",
            error: "Unable to load products."
        });
    }
};

exports.showProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("seller", "name email");

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render("productDetails", {
            product
        });
    } catch (error) {
        res.status(404).send("Invalid product ID");
    }
};

exports.showSell = (req, res) => {
    res.render("sell", {
        error: null
    });
};

exports.createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            category,
            location,
            image
        } = req.body;

        if (
            !title ||
            !description ||
            !price ||
            !category ||
            !location
        ) {
            return res.render("sell", {
                error: "Please fill all required fields."
            });
        }

        if (Number(price) < 0) {
            return res.render("sell", {
                error: "Price cannot be negative."
            });
        }

        await Product.create({
            title,
            description,
            price: Number(price),
            category,
            location,
            image:
                image ||
                "https://via.placeholder.com/400x250?text=No+Image",
            seller: req.session.user.id
        });

        res.redirect("/my-listings");
    } catch (error) {
        console.error(error);

        res.render("sell", {
            error: "Unable to create listing."
        });
    }
};

exports.myListings = async (req, res) => {
    try {
        const products = await Product.find({
            seller: req.session.user.id
        }).sort({ createdAt: -1 });

        res.render("myListings", {
            products
        });
    } catch (error) {
        console.error(error);

        res.render("myListings", {
            products: []
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            seller: req.session.user.id
        });

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        await Product.findByIdAndDelete(req.params.id);

        res.redirect("/my-listings");
    } catch (error) {
        console.error(error);

        res.status(500).send("Unable to delete product.");
    }
};