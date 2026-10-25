const express = require("express");
const SurveyResponse = require("../models/SurveyResponse");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/responses", adminAuth, async (req, res, next) => {
  try {
    const responses = await SurveyResponse.find().sort({ createdAt: -1 }).limit(200);
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
