const express = require("express");

const {
    createPost,
    getFeed,
    toggleLike,
    deletePost
} = require("../controllers/postController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router =
    express.Router();

router.get(
    "/feed",
    authMiddleware,
    getFeed
);

router.post(
    "/",
    authMiddleware,
    createPost
);

router.put(
    "/:id/like",
    authMiddleware,
    toggleLike
);

router.delete(
    "/:id",
    authMiddleware,
    deletePost
);

module.exports = router;