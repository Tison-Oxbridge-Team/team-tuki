const express = require("express");
const mongoose = require("mongoose");
const Round = require("../models/Round");
const Judge = require("../models/Judge");
const Startup = require("../models/Startup");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function: Validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route POST /api/rounds
 * @desc Create a new round
 */
router.post("/", authenticateToken, async (req, res) => {
  const { name, criteria } = req.body;

  try {
    // Validate input
    if (!name || !criteria || !Array.isArray(criteria)) {
      return res.status(400).json({ message: "Invalid data format." });
    }

    // Create a new round
    const newRound = new Round({ name, criteria });
    const savedRound = await newRound.save();

    res.status(201).json({ message: "Round created successfully", round: savedRound });
  } catch (err) {
    console.error("Error creating round:", err);
    res.status(500).json({ message: "Error creating round", error: err.message });
  }
});

/**
 * @route POST /api/rounds/import-criteria
 * @desc Import criteria for a round
 */
router.post("/import-criteria", authenticateToken, async (req, res) => {
  const { roundId, criteria } = req.body;

  try {
    if (!isValidObjectId(roundId)) {
      return res.status(400).json({ message: "Invalid round ID." });
    }
    if (!Array.isArray(criteria)) {
      return res.status(400).json({ message: "Criteria must be an array." });
    }

    const round = await Round.findById(roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found." });
    }

    round.criteria.push(...criteria);
    const updatedRound = await round.save();

    res.status(200).json({ message: "Criteria imported successfully", round: updatedRound });
  } catch (err) {
    console.error("Error importing criteria:", err);
    res.status(500).json({ message: "Error importing criteria", error: err.message });
  }
});

/**
 * @route POST /api/rounds/schedule
 * @desc Create schedules and sessions for a round
 */
router.post("/schedule", authenticateToken, async (req, res) => {
  const { roundId, schedules } = req.body;

  try {
    if (!isValidObjectId(roundId)) {
      return res.status(400).json({ message: "Invalid round ID." });
    }
    if (!Array.isArray(schedules)) {
      return res.status(400).json({ message: "Schedules must be an array." });
    }

    const round = await Round.findById(roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found." });
    }

    for (const schedule of schedules) {
      const { date, sessions } = schedule;

      if (!date || !Array.isArray(sessions)) {
        return res.status(400).json({ message: "Invalid schedule data." });
      }

      round.schedule.push({ date, sessions });
    }

    const updatedRound = await round.save();
    res.status(201).json({ message: "Schedules created successfully", round: updatedRound });
  } catch (err) {
    console.error("Error creating schedules:", err);
    res.status(500).json({ message: "Error creating schedules", error: err.message });
  }
});

/**
 * @route POST /api/rounds/timeslot
 * @desc Add a timeslot to a specific session within a schedule
 */
router.post("/timeslot", authenticateToken, async (req, res) => {
  const { roundId, scheduleId, sessionId, timeslot } = req.body;

  try {
    // Validate IDs
    if (!isValidObjectId(roundId) || !isValidObjectId(scheduleId) || !isValidObjectId(sessionId)) {
      return res.status(400).json({ message: "Invalid IDs provided." });
    }

    // Validate timeslot data
    const { startupId, judges, startTime, endTime, room } = timeslot;
    if (!isValidObjectId(startupId) || !Array.isArray(judges) || judges.length < 3) {
      return res.status(400).json({
        message: "Invalid timeslot data: Provide a valid startup ID and at least 3 judges.",
      });
    }
    if (!startTime || !endTime || !room) {
      return res.status(400).json({ message: "Missing timeslot details: startTime, endTime, and room are required." });
    }

    const round = await Round.findById(roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found." });
    }

    const schedule = round.schedule.id(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    const session = schedule.sessions.id(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    // Check for overlapping timeslots
    const overlappingTimeslots = session.timeslots.filter(
      (slot) =>
        new Date(slot.startTime).getTime() < new Date(endTime).getTime() &&
        new Date(slot.endTime).getTime() > new Date(startTime).getTime()
    );

    if (overlappingTimeslots.length > 0) {
      return res.status(400).json({
        message: "Overlapping timeslot detected.",
        overlappingTimeslots,
      });
    }

    // Add the timeslot
    session.timeslots.push({ startupId, judges, startTime, endTime, room });

    const updatedRound = await round.save();
    res.status(201).json({
      message: "Timeslot added successfully",
      timeslot: session.timeslots[session.timeslots.length - 1],
    });
  } catch (err) {
    console.error("Error adding timeslot:", err);
    res.status(500).json({ message: "Error adding timeslot", error: err.message });
  }
});


/**
 * @route GET /api/rounds/:roundId/schedules/:scheduleId/timeslots
 * @desc Get all timeslots for a schedule
 */
router.get("/:roundId/schedules/:scheduleId/timeslots", authenticateToken, async (req, res) => {
  const { roundId, scheduleId } = req.params;

  try {
    if (!isValidObjectId(roundId) || !isValidObjectId(scheduleId)) {
      return res.status(400).json({ message: "Invalid IDs provided." });
    }

    const round = await Round.findById(roundId).populate("schedule.sessions.timeslots.judges schedule.sessions.timeslots.startupId");
    if (!round) {
      return res.status(404).json({ message: "Round not found." });
    }

    const schedule = round.schedule.id(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    res.status(200).json({
      message: "Timeslots fetched successfully",
      timeslots: schedule.sessions.flatMap((session) => session.timeslots),
    });
  } catch (err) {
    console.error("Error fetching timeslots:", err);
    res.status(500).json({ message: "Error fetching timeslots", error: err.message });
  }
});
/**
 * @route GET /api/rounds/:roundId/schedules
 * @desc Get all schedules for a round
 */
router.get("/:roundId/schedules", authenticateToken, async (req, res) => {
  const { roundId } = req.params;

  try {
    if (!isValidObjectId(roundId)) {
      return res.status(400).json({ message: "Invalid round ID provided." });
    }

    const round = await Round.findById(roundId).populate("schedule.sessions.timeslots.judges schedule.sessions.timeslots.startupId");
    if (!round) {
      return res.status(404).json({ message: "Round not found." });
    }

    res.status(200).json({
      message: "Schedules fetched successfully",
      schedules: round.schedule,
    });
  } catch (err) {
    console.error("Error fetching schedules:", err);
    res.status(500).json({ message: "Error fetching schedules", error: err.message });
  }
});

module.exports = router;
