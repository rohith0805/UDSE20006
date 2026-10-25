const express = require("express");
const Question = require("../models/Question");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Public: return five random questions without exposing internal metadata.
router.get("/random", async (req, res, next) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
    if (questions.length < 5) {
      return res.status(409).json({
        message: "At least five questions must exist before a survey can begin."
      });
    }
    res.json(questions.map(({ _id, text, type, options }) => ({ _id, text, type, options })));
  } catch (error) {
    next(error);
  }
});

// Admin: list question bank.
router.get("/", adminAuth, async (req, res, next) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    next(error);
  }
});

// Admin: create a question.
router.post("/", adminAuth, async (req, res, next) => {
  try {
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
    const type = req.body.type;
    let options = Array.isArray(req.body.options)
      ? req.body.options.map((item) => String(item).trim()).filter(Boolean)
      : [];

    if (!text) return res.status(400).json({ message: "Question text is required." });
    if (!["multiple-choice", "short-answer"].includes(type)) {
      return res.status(400).json({ message: "Choose a valid question type." });
    }
    if (type === "multiple-choice" && options.length < 2) {
      return res.status(400).json({ message: "Add at least two answer options." });
    }
    if (type === "short-answer") options = [];

    const question = await Question.create({ text, type, options });
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
});

// Admin: delete a question.
router.delete("/:id", adminAuth, async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found." });
    res.json({ message: "Question deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
