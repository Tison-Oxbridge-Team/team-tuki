const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Judge = require("../models/Judge");
const Session = require("../models/Session");
const Score = require("../models/Score");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET 


const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send credentials email
async function sendCredentialsEmail(email, password, name) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OXBRIDGE AIX JUDGE ACCOUNT.",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://cdn.discordapp.com/attachments/1307061897958527006/1308462819921887293/Oxbridge.png?ex=673e0876&is=673cb6f6&hm=74915ce7ef670d13946659191af77b7a6c58e2ae5cd954804b6fba3bd2972c33&" alt="Oxbridge AI Logo" style="max-width: 200px; height: auto;">
      </div>
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #252525; text-align: center; margin-bottom: 25px;">Welcome ${name}! 🎉</h2>
        <p style="color: #242424; line-height: 1.6;">Your judge account has been created successfully. Here are your login credentials:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong style="color: #252525;">Email:</strong> <span style="color: #89c5c9;">${email}</span></p>
          <p style="margin: 10px 0;"><strong style="color: #252525;">Password:</strong> <span style="color: #89c5c9;">${password}</span></p>
        </div>
        <p style="color: black; font-weight: bold;">Please keep these credentials safe and change your password after your first login.</p>
        <p style="color: #242424; line-height: 1.6;">If you have any questions or need assistance, please don't hesitate to contact us.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #242424; margin: 0;">Best regards,<br><strong>The Competition Team</strong></p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #252525; font-size: 12px;">
        <p> OxbridgeAIX. All rights reserved.</p>
      </div>
    </div>
    `  };

  return transporter.sendMail(mailOptions);
}

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
    await sendCredentialsEmail(email, password, name);

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

// Get all judges
router.get("/", authenticateToken, async (req, res) => {
  try {
    const judges = await Judge.find().select("-password");
    res.status(200).json({ judges });
  } catch (err) {
    console.error("Error fetching judges:", err);
    res.status(500).json({ message: "Error fetching judges", error: err.message });
  }
});

// Get judge by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const judge = await Judge.findById(req.params.id).select("-password");
    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }
    res.status(200).json({ judge });
  } catch (err) {
    console.error("Error fetching judge:", err);
    res.status(500).json({ message: "Error fetching judge", error: err.message });
  }
});

// Edit judge
router.put("/:id", authenticateToken, async (req, res) => {
  const { name, email, expertise } = req.body;
  
  try {
    const judge = await Judge.findById(req.params.id);
    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    if (email && email !== judge.email) {
      const existingJudge = await Judge.findOne({ email });
      if (existingJudge) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const updatedJudge = await Judge.findByIdAndUpdate(
      req.params.id,
      { name, email, expertise },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Judge updated successfully", judge: updatedJudge });
  } catch (err) {
    console.error("Error updating judge:", err);
    res.status(500).json({ message: "Error updating judge", error: err.message });
  }
});

// Delete judge
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const judge = await Judge.findById(req.params.id);
    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    await Judge.findByIdAndDelete(req.params.id);
    
    // Delete associated scores
    await Score.deleteMany({ judgeId: req.params.id });
    
    // Remove judge from any sessions they were part of
    await Session.updateMany(
      { judges: req.params.id },
      { $pull: { judges: req.params.id } }
    );

    res.status(200).json({ message: "Judge deleted successfully" });
  } catch (err) {
    console.error("Error deleting judge:", err);
    res.status(500).json({ message: "Error deleting judge", error: err.message });
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
// Import Bulk Judges
router.post("/bulk-import", authenticateToken, async (req, res) => {
  try {
    const { judges } = req.body; // Expecting an array of judge objects

    // Validate the input
    if (!Array.isArray(judges)) {
      return res.status(400).json({ message: "Invalid input format. Expected an array of judges." });
    }

    // Hash passwords for all judges
    const judgesWithHashedPasswords = await Promise.all(
      judges.map(async (judge) => {
        const hashedPassword = await bcrypt.hash(judge.password, 10);
        return {
          ...judge,
          password: hashedPassword,
        };
      })
    );

    // Insert all judges
    const result = await Judge.insertMany(judgesWithHashedPasswords);

    res.status(201).json({
      message: "Judges imported successfully",
      count: result.length,
    });
  } catch (err) {
    console.error("Error importing judges:", err);
    res.status(500).json({ message: "Error importing judges", error: err.message });
  }
});


module.exports = router