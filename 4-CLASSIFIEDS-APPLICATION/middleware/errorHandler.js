const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    res.status(500).render("home", {
        products: [],
        error: "Something went wrong. Please try again."
    });
};

module.exports = errorHandler;