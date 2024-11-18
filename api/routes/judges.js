const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Judge = require("../models/Judge");
const Session = require("../models/Session");
const Score = require("../models/Score");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET 



// Add Judge
router.post("/add", authenticateToken, async (req, res) => {
  const { name, email, password, expertise } = req.body;

  try {
    const existingJudge = await Judge.findOne({ email });
    if (existingJudge) {
      return res.status(409).json({ message: "Judge with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newJudge = new Judge({ name, email, password: hashedPassword, expertise });
    await newJudge.save();

    res.status(201).json({ message: "Judge added successfully", judge: newJudge });
  } catch (err) {
    console.error("Error adding judge:", err);
    res.status(500).json({ message: "Error adding judge", error: err.message });
  }
});
// Judge Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const judge = await Judge.findOne({ email });
    if (!judge) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, judge.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: judge._id, email: judge.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, judge: { name: judge.name, email: judge.email } });
  } catch (err) {
    console.error("Error logging in judge:", err);
    res.status(500).json({ message: "Error logging in judge", error: err.message });
  }
});
// Get Sessions for a Judge
router.get("/sessions", authenticateToken, async (req, res) => {
  const { judgeId } = req.user; // Assuming judgeId is stored in the token

  try {
    const sessions = await Session.find({ judges: judgeId })
      .populate("timeslots")
      .populate("roundId");

    res.status(200).json({ sessions });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ message: "Error fetching sessions", error: err.message });
  }
});
// Submit Scores
router.post("/submit-scores", authenticateToken, async (req, res) => {
  const { judgeId } = req.user; // From token
  const { startupId, roundId, criteriaScores, feedback } = req.body;

  try {
    const newScore = new Score({ judgeId, startupId, roundId, criteriaScores, feedback });
    await newScore.save();

    res.status(201).json({ message: "Scores submitted successfully", score: newScore });
  } catch (err) {
    console.error("Error submitting scores:", err);
    res.status(500).json({ message: "Error submitting scores", error: err.message });
  }
});
// Get Evaluation History
router.get("/history", authenticateToken, async (req, res) => {
  const { judgeId } = req.user;

  try {
    const scores = await Score.find({ judgeId }).populate("startupId roundId");
    res.status(200).json({ scores });
  } catch (err) {
    console.error("Error fetching evaluation history:", err);
    res.status(500).json({ message: "Error fetching evaluation history", error: err.message });
  }
});


module.exports = router