const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    questionText: { type: String, required: true },
    answer: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const surveyResponseSchema = new mongoose.Schema(
  {
    answers: {
      type: [answerSchema],
      required: true,
      validate: {
        validator: (answers) => answers.length === 5,
        message: "A survey response must contain exactly five answers."
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SurveyResponse", surveyResponseSchema);
