const express = require("express");

const {
    getComments,
    createComment,
    deleteComment
} = require("../controllers/commentController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router =
    express.Router();

router.get(
    "/:postId",
    authMiddleware,
    getComments
);

router.post(
    "/:postId",
    authMiddleware,
    createComment
);

router.delete(
    "/:id",
    authMiddleware,
    deleteComment
);

module.exports = router;