const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const createToken = (userId) => {

    return jwt.sign(
        {
            userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};


// REGISTER
const registerUser = async (req, res) => {

    try {

        const {
            name,
            username,
            email,
            password
        } = req.body;

        if (
            !name ||
            !username ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser =
            await User.findOne({
                $or: [
                    { email },
                    { username }
                ]
            });

        if (existingUser) {

            return res.status(400).json({
                message:
                    "Email or username already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await User.create({
                name,
                username,
                email,
                password: hashedPassword
            });

        const token =
            createToken(user._id);

        res.status(201).json({

            message:
                "Registration successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// LOGIN
const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        const token =
            createToken(user._id);

        res.json({

            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};