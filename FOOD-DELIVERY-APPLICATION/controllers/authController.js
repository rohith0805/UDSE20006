const bcrypt = require("bcryptjs");

const User = require("../models/User");


// Show login page
const showLogin = (req, res) => {

    res.render("login", {
        error: null
    });
};


// Show register page
const showRegister = (req, res) => {

    res.render("register", {
        error: null
    });
};


// Register user
const register = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {

            return res.render("register", {
                error: "All fields are required"
            });
        }

        if (password.length < 6) {

            return res.render("register", {
                error:
                    "Password must contain at least 6 characters"
            });
        }

        const existingUser =
            await User.findOne({
                email: email.toLowerCase()
            });

        if (existingUser) {

            return res.render("register", {
                error:
                    "An account with this email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        req.session.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email
        };

        res.redirect("/");

    } catch (error) {

        next(error);
    }
};


// Login user
const login = async (req, res, next) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.render("login", {
                error: "Email and password are required"
            });
        }

        const user =
            await User.findOne({
                email: email.toLowerCase()
            });

        if (!user) {

            return res.render("login", {
                error: "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.render("login", {
                error: "Invalid email or password"
            });
        }

        req.session.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email
        };

        res.redirect("/");

    } catch (error) {

        next(error);
    }
};


// Logout
const logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");
    });
};


module.exports = {
    showLogin,
    showRegister,
    register,
    login,
    logout
};