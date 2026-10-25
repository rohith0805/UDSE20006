require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const questionRoutes = require("./routes/questionRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5175",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "x-admin-key"]
}));
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => res.json({ message: "Online Survey API is running." }));
app.use("/api/questions", questionRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found." }));

app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: "Server error. Please try again." });
});

connectDB()
  .then(() => app.listen(PORT, () => console.log(`API listening at http://localhost:${PORT}`)))
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
