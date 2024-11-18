const express = require("express");
const router = express.Router();
const Startup = require("../models/Startup");
const { authenticateToken } = require("../middleware/authMiddleware");

// Add a Startup
router.post("/", authenticateToken, async (req, res) => {
  const { name, teamLeader, email, pitchSchedule, room, remoteRoom } = req.body;

  try {
    // Check if the startup already exists
    const existingStartup = await Startup.findOne({ email });
    if (existingStartup) {
      return res.status(409).json({ message: "Startup with this email already exists" });
    }

    const newStartup = new Startup({ name, teamLeader, email, pitchSchedule, room, remoteRoom });
    const savedStartup = await newStartup.save();

    res.status(201).json({ message: "Startup added successfully", startup: savedStartup });
  } catch (err) {
    console.error("Error adding startup:", err);
    res.status(500).json({ message: "Error adding startup", error: err.message });
  }
});
// Get All Startups
router.get("/", authenticateToken, async (req, res) => {
  try {
    const startups = await Startup.find();
    res.status(200).json({ startups });
  } catch (err) {
    console.error("Error fetching startups:", err);
    res.status(500).json({ message: "Error fetching startups", error: err.message });
  }
});
// Get a Specific Startup
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Startup ID" });
  }

  try {
    const startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    res.status(200).json({ startup });
  } catch (err) {
    console.error("Error fetching startup:", err);
    res.status(500).json({ message: "Error fetching startup", error: err.message });
  }
});
// Update a Startup
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Startup ID" });
  }

  try {
    const updatedStartup = await Startup.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedStartup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    res.status(200).json({ message: "Startup updated successfully", startup: updatedStartup });
  } catch (err) {
    console.error("Error updating startup:", err);
    res.status(500).json({ message: "Error updating startup", error: err.message });
  }
});
// Delete a Startup
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Startup ID" });
  }

  try {
    const deletedStartup = await Startup.findByIdAndDelete(id);
    if (!deletedStartup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    res.status(200).json({ message: "Startup deleted successfully" });
  } catch (err) {
    console.error("Error deleting startup:", err);
    res.status(500).json({ message: "Error deleting startup", error: err.message });
  }
});
// Bulk Import Startups
router.post("/import", authenticateToken, async (req, res) => {
  const startups = req.body; // Array of startup objects

  if (!Array.isArray(startups)) {
    return res.status(400).json({ message: "Invalid data format. Expecting an array." });
  }

  try {
    const createdStartups = await Startup.insertMany(startups);
    res.status(201).json({ message: "Startups imported successfully", startups: createdStartups });
  } catch (err) {
    console.error("Error importing startups:", err);
    res.status(500).json({ message: "Error importing startups", error: err.message });
  }
});


module.exports = router;