const express = require("express");

const {
    getProfile,
    toggleFollow,
    updateProfile
} = require("../controllers/userController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router =
    express.Router();

router.get(
    "/profile/:username",
    authMiddleware,
    getProfile
);

router.put(
    "/follow/:username",
    authMiddleware,
    toggleFollow
);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);

module.exports = router;