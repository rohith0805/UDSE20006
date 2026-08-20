const errorHandler = (err, req, res, next) => {

    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).send(`
        <html>
            <head>
                <title>Error - FoodExpress</title>
            </head>

            <body style="
                font-family: Arial;
                text-align: center;
                padding: 50px;
            ">

                <h1>Something went wrong</h1>

                <p>
                    ${err.message || "Server error"}
                </p>

                <a href="/">
                    Go Home
                </a>

            </body>
        </html>
    `);
};

module.exports = errorHandler;