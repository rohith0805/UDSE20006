const express = require("express");
const mongoose = require("mongoose");
const Question = require("../models/Question");
const SurveyResponse = require("../models/SurveyResponse");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const answers = req.body.answers;

    if (!Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({ message: "Please submit answers to all five questions." });
    }

    const ids = answers.map((item) => String(item.questionId || ""));
    if (new Set(ids).size !== 5 || ids.some((id) => !mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: "The submitted question list is invalid." });
    }

    const questions = await Question.find({ _id: { $in: ids } });
    if (questions.length !== 5) {
      return res.status(400).json({ message: "One or more questions no longer exist. Please reload the survey." });
    }

    const questionMap = new Map(questions.map((question) => [String(question._id), question]));
    const normalizedAnswers = [];

    for (const item of answers) {
      const question = questionMap.get(String(item.questionId));
      const answer = typeof item.answer === "string" ? item.answer.trim() : "";

      if (!answer) return res.status(400).json({ message: "All five questions must be answered." });
      if (question.type === "multiple-choice" && !question.options.includes(answer)) {
        return res.status(400).json({ message: "An answer does not match the available options." });
      }

      normalizedAnswers.push({
        questionId: question._id,
        questionText: question.text,
        answer
      });
    }

    const response = await SurveyResponse.create({ answers: normalizedAnswers });
    res.status(201).json({
      message: "Thank you! Your survey has been submitted successfully.",
      responseId: response._id
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
