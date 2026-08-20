const User = require("../models/User");


// GET PROFILE
const getProfile = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.username
            );

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({

            id: user._id,

            name: user.name,

            username: user.username,

            bio: user.bio,

            followers:
                user.followers.length,

            following:
                user.following.length
        });

    } catch (error) {

        try {

            const user =
                await User.findOne({
                    username:
                        req.params.username
                });

            if (!user) {

                return res.status(404).json({
                    message:
                        "User not found"
                });
            }

            res.json({

                id: user._id,

                name: user.name,

                username: user.username,

                bio: user.bio,

                followers:
                    user.followers.length,

                following:
                    user.following.length
            });

        } catch (err) {

            res.status(500).json({
                message:
                    "Failed to load profile"
            });
        }
    }
};


// FOLLOW / UNFOLLOW
const toggleFollow = async (req, res) => {

    try {

        const currentUser =
            await User.findById(
                req.user.id
            );

        const targetUser =
            await User.findOne({
                username:
                    req.params.username
            });

        if (!targetUser) {

            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        if (
            currentUser._id.toString() ===
            targetUser._id.toString()
        ) {

            return res.status(400).json({
                message:
                    "You cannot follow yourself"
            });
        }

        const following =
            currentUser.following.some(
                id =>
                    id.toString() ===
                    targetUser._id.toString()
            );

        if (following) {

            currentUser.following =
                currentUser.following.filter(
                    id =>
                        id.toString() !==
                        targetUser._id.toString()
                );

            targetUser.followers =
                targetUser.followers.filter(
                    id =>
                        id.toString() !==
                        currentUser._id.toString()
                );

        } else {

            currentUser.following.push(
                targetUser._id
            );

            targetUser.followers.push(
                currentUser._id
            );
        }

        await currentUser.save();
        await targetUser.save();

        res.json({
            following: !following
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to update follow"
        });
    }
};


// UPDATE PROFILE
const updateProfile = async (req, res) => {

    try {

        const {
            name,
            bio
        } = req.body;

        const user =
            await User.findById(
                req.user.id
            );

        if (!user) {

            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        await user.save();

        res.json({

            message:
                "Profile updated",

            user: {
                name: user.name,
                username: user.username,
                bio: user.bio
            }
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to update profile"
        });
    }
};

module.exports = {
    getProfile,
    toggleFollow,
    updateProfile
};