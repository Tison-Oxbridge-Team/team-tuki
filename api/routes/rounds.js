const express = require("express");
const router = express.Router();
const Round = require("../models/Round");
const { authenticateToken } = require("../middleware/authMiddleware");

// Create a New Round
router.post("/", authenticateToken, async (req, res) => {
  const { name, dates, criteria, settings } = req.body;

  try {
    // Ensure dates are provided and valid
    if (!Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ message: "At least one date must be provided." });
    }

    // Ensure criteria weights sum to 100
    const totalWeight = criteria.reduce((sum, crit) => sum + crit.weight, 0);
    if (totalWeight !== 100) {
      return res.status(400).json({ message: "Total weight of criteria must equal 100%." });
    }

    const newRound = new Round({ name, dates, criteria, settings });
    const savedRound = await newRound.save();

    res.status(201).json({ message: "Round created successfully", round: savedRound });
  } catch (err) {
    console.error("Error creating round:", err);
    res.status(500).json({ message: "Error creating round", error: err.message });
  }
});
// Get All Rounds
router.get("/", authenticateToken, async (req, res) => {
  try {
    const rounds = await Round.find();
    res.status(200).json({ rounds });
  } catch (err) {
    console.error("Error fetching rounds:", err);
    res.status(500).json({ message: "Error fetching rounds", error: err.message });
  }
});
// Get a Specific Round
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const round = await Round.findById(id);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    res.status(200).json({ round });
  } catch (err) {
    console.error("Error fetching round:", err);
    res.status(500).json({ message: "Error fetching round", error: err.message });
  }
});
// Update a Round
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedRound = await Round.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedRound) {
      return res.status(404).json({ message: "Round not found" });
    }

    res.status(200).json({ message: "Round updated successfully", round: updatedRound });
  } catch (err) {
    console.error("Error updating round:", err);
    res.status(500).json({ message: "Error updating round", error: err.message });
  }
});
// Delete a Round
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRound = await Round.findByIdAndDelete(id);
    if (!deletedRound) {
      return res.status(404).json({ message: "Round not found" });
    }

    res.status(200).json({ message: "Round deleted successfully" });
  } catch (err) {
    console.error("Error deleting round:", err);
    res.status(500).json({ message: "Error deleting round", error: err.message });
  }
});
// Update Round Settings
router.put("/:id/settings", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { allowMultipleJudges, enableNotifications } = req.body;

  try {
    const round = await Round.findById(id);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    round.settings = { allowMultipleJudges, enableNotifications };
    await round.save();

    res.status(200).json({ message: "Settings updated successfully", settings: round.settings });
  } catch (err) {
    console.error("Error updating round settings:", err);
    res.status(500).json({ message: "Error updating round settings", error: err.message });
  }
});
module.exports = router;