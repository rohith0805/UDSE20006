const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");

const connectDB =
    require("./config/db");

const auth =
    require("./middleware/auth");

dotenv.config();

const app = express();


// ==========================
// DATABASE
// ==========================

connectDB();


// ==========================
// MIDDLEWARE
// ==========================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================
// SESSION
// ==========================

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "food_delivery_secret",

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge:
                24 * 60 * 60 * 1000,

            httpOnly: true
        }
    })
);


// ==========================
// GLOBAL USER
// ==========================

app.use(
    (req, res, next) => {

        res.locals.user =
            req.session.user || null;

        next();
    }
);


// ==========================
// STATIC FILES
// ==========================

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


// ==========================
// EJS
// ==========================

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(
        __dirname,
        "views"
    )
);


// ==========================
// ROUTES
// ==========================

app.use(
    "/auth",
    require("./routes/authRoutes")
);

app.use(
    "/restaurants",
    require("./routes/restaurantRoutes")
);

app.use(
    "/food",
    require("./routes/foodRoutes")
);

app.use(
    "/orders",
    require("./routes/orderRoutes")
);


// ==========================
// HOME
// ==========================

app.get(
    "/",
    (req, res) => {

        res.render("home");
    }
);


// ==========================
// CART
// ==========================

app.get(
    "/cart",
    auth,
    (req, res) => {

        res.render("cart");
    }
);


// ==========================
// CHECKOUT
// ==========================

app.get(
    "/checkout",
    auth,
    (req, res) => {

        res.render("checkout");
    }
);


// ==========================
// 404
// ==========================

app.use(
    (req, res) => {

        res.status(404).send(`
            <h1>404 - Page Not Found</h1>
            <a href="/">Go Home</a>
        `);
    }
);


// ==========================
// ERROR HANDLER
// ==========================

app.use(
    require("./middleware/errorHandler")
);


// ==========================
// START SERVER
// ==========================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );
    }
);