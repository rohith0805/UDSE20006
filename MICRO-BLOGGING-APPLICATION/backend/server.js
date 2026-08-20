const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const connectDB =
    require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const postRoutes =
    require("./routes/postRoutes");

const userRoutes =
    require("./routes/userRoutes");

const commentRoutes =
    require("./routes/commentRoutes");

connectDB();

const app =
    express();

app.use(cors());

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


// API ROUTES

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/posts",
    postRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/comments",
    commentRoutes
);


// FRONTEND

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);


app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../frontend/index.html"
            )
        );
    }
);


const PORT =
    process.env.PORT || 5001;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);