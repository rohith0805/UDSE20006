const Comment = require("../models/Comment");
const Post = require("../models/Post");


// GET COMMENTS
const getComments = async (req, res) => {

    try {

        const comments =
            await Comment.find({
                post: req.params.postId
            })
                .populate(
                    "author",
                    "name username"
                )
                .sort({
                    createdAt: 1
                });

        res.json(comments);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to load comments"
        });
    }
};


// CREATE COMMENT
const createComment = async (req, res) => {

    try {

        const {
            content
        } = req.body;

        if (!content || !content.trim()) {

            return res.status(400).json({
                message:
                    "Comment is required"
            });
        }

        const post =
            await Post.findById(
                req.params.postId
            );

        if (!post) {

            return res.status(404).json({
                message:
                    "Post not found"
            });
        }

        const comment =
            await Comment.create({

                content,

                author:
                    req.user.id,

                post:
                    req.params.postId
            });

        const populated =
            await Comment.findById(
                comment._id
            ).populate(
                "author",
                "name username"
            );

        res.status(201).json(
            populated
        );

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to create comment"
        });
    }
};


// DELETE COMMENT
const deleteComment = async (req, res) => {

    try {

        const comment =
            await Comment.findOne({
                _id: req.params.id,
                author: req.user.id
            });

        if (!comment) {

            return res.status(404).json({
                message:
                    "Comment not found"
            });
        }

        await Comment.findByIdAndDelete(
            comment._id
        );

        res.json({
            message:
                "Comment deleted"
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to delete comment"
        });
    }
};

module.exports = {
    getComments,
    createComment,
    deleteComment
};