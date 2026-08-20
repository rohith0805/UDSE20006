const auth = (req, res, next) => {

    if (!req.session.user) {

        if (
            req.xhr ||
            req.headers.accept?.includes("application/json")
        ) {
            return res.status(401).json({
                success: false,
                message: "Please login to continue",
                redirect: "/auth/login"
            });
        }

        return res.redirect("/auth/login");
    }

    next();
};

module.exports = auth;