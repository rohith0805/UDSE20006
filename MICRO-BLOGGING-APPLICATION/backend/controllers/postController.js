const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");


// CREATE POST
const createPost = async (req, res) => {

    try {

        const { content } = req.body;

        if (!content || !content.trim()) {

            return res.status(400).json({
                message: "Post content is required"
            });
        }

        if (content.length > 280) {

            return res.status(400).json({
                message:
                    "Post cannot exceed 280 characters"
            });
        }

        const post =
            await Post.create({
                content,
                author: req.user.id
            });

        const populatedPost =
            await Post.findById(post._id)
                .populate(
                    "author",
                    "name username"
                );

        res.status(201).json(
            populatedPost
        );

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to create post"
        });
    }
};


// GET FEED
const getFeed = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.user.id
            );

        const following =
            user.following || [];

        const authors = [
            ...following,
            req.user.id
        ];

        const posts =
            await Post.find({
                author: {
                    $in: authors
                }
            })
                .populate(
                    "author",
                    "name username"
                )
                .sort({
                    createdAt: -1
                });

        res.json(posts);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to load feed"
        });
    }
};


// LIKE / UNLIKE POST
const toggleLike = async (req, res) => {

    try {

        const post =
            await Post.findById(
                req.params.id
            );

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });
        }

        const userId =
            req.user.id.toString();

        const index =
            post.likes.findIndex(
                id =>
                    id.toString() === userId
            );

        if (index === -1) {

            post.likes.push(req.user.id);

        } else {

            post.likes.splice(
                index,
                1
            );
        }

        await post.save();

        res.json({
            likes: post.likes.length,
            liked: index === -1
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to update like"
        });
    }
};


// DELETE POST
const deletePost = async (req, res) => {

    try {

        const post =
            await Post.findOne({
                _id: req.params.id,
                author: req.user.id
            });

        if (!post) {

            return res.status(404).json({
                message:
                    "Post not found or unauthorized"
            });
        }

        await Comment.deleteMany({
            post: post._id
        });

        await Post.findByIdAndDelete(
            post._id
        );

        res.json({
            message:
                "Post deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to delete post"
        });
    }
};

module.exports = {
    createPost,
    getFeed,
    toggleLike,
    deletePost
};