// Optional seed script: creates sample questions if the question collection is empty.
// Run from backend with: npm run seed
require("dotenv").config();
const connectDB = require("./config/db");
const Question = require("./models/Question");

const sampleQuestions = [
  { text: "How would you rate your overall experience with this survey?", type: "multiple-choice", options: ["Excellent", "Good", "Average", "Poor"] },
  { text: "How easy was it to understand the questions?", type: "multiple-choice", options: ["Very easy", "Easy", "Neutral", "Difficult"] },
  { text: "Which topic would you most like to learn about?", type: "multiple-choice", options: ["Technology", "Education", "Health", "Environment"] },
  { text: "What is one thing that could be improved?", type: "short-answer", options: [] },
  { text: "Do you have any additional comments or suggestions?", type: "short-answer", options: [] },
  { text: "How often do you participate in online surveys?", type: "multiple-choice", options: ["Often", "Sometimes", "Rarely", "Never"] },
  { text: "Would you recommend this survey to a friend?", type: "multiple-choice", options: ["Definitely", "Probably", "Not sure", "No"] },
  { text: "What device did you use to complete this survey?", type: "multiple-choice", options: ["Mobile phone", "Laptop", "Desktop computer", "Tablet"] }
];

(async () => {
  try {
    await connectDB();
    const count = await Question.countDocuments();
    if (count === 0) {
      await Question.insertMany(sampleQuestions);
      console.log(`Inserted ${sampleQuestions.length} sample questions.`);
    } else {
      console.log(`Question bank already has ${count} questions; no sample questions inserted.`);
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
