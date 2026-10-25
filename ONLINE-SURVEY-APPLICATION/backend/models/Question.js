const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    type: { type: String, enum: ["multiple-choice", "short-answer"], required: true },
    options: {
      type: [String],
      default: [],
      validate: {
        validator(options) {
          return this.type !== "multiple-choice" ||
            (options.length >= 2 && options.every((option) => option.trim().length > 0));
        },
        message: "Multiple-choice questions need at least two non-empty options."
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
