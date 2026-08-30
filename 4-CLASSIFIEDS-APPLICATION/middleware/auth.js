const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login?error=Please login first");
    }

    next();
};

module.exports = auth;