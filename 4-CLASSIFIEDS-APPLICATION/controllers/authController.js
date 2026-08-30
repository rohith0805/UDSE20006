const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.showRegister = (req, res) => {
    res.render("register", {
        error: null
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.render("register", {
                error: "All fields are required."
            });
        }

        if (password !== confirmPassword) {
            return res.render("register", {
                error: "Passwords do not match."
            });
        }

        if (password.length < 6) {
            return res.render("register", {
                error: "Password must contain at least 6 characters."
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.render("register", {
                error: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
        console.error(error);

        res.render("register", {
            error: "Registration failed."
        });
    }
};

exports.showLogin = (req, res) => {
    res.render("login", {
        error: req.query.error || null
    });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("login", {
                error: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.render("login", {
                error: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.render("login", {
                error: "Invalid email or password."
            });
        }

        req.session.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email
        };

        res.redirect("/");
    } catch (error) {
        console.error(error);

        res.render("login", {
            error: "Login failed."
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};