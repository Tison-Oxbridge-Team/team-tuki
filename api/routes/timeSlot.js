const express = require("express");
const mongoose = require("mongoose");
const Timeslot = require("../models/Timeslot");
const Session = require("../models/Session");
const Startup = require("../models/Startup");
const Judge = require("../models/Judge");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper function to check time overlap
const isTimeOverlap = (start1, end1, start2, end2) => {
  return new Date(start1) < new Date(end2) && new Date(end1) > new Date(start2);
};

// 1. Generate Timeslots for a Session
router.post("/generate", authenticateToken, async (req, res) => {
  const { sessionId, slotDuration } = req.body;

  if (!isValidObjectId(sessionId)) {
    return res.status(400).json({ message: "Invalid Session ID" });
  }

  try {
    const session = await Session.findById(sessionId).populate("timeslots");
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const { startTime, endTime } = session;
    const sessionStart = new Date(startTime);
    const sessionEnd = new Date(endTime);

    const totalMinutes = (sessionEnd - sessionStart) / 60000; // Convert to minutes
    const numSlots = Math.floor(totalMinutes / slotDuration);

    // Clear existing timeslots for the session
    await Timeslot.deleteMany({ sessionId });

    const timeslots = [];
    for (let i = 0; i < numSlots; i++) {
      const slotStartTime = new Date(sessionStart.getTime() + i * slotDuration * 60000);
      const slotEndTime = new Date(slotStartTime.getTime() + slotDuration * 60000);

      const newTimeslot = new Timeslot({
        scheduleId: session.scheduleId,
        sessionId,
        startTime: slotStartTime,
        endTime: slotEndTime,
        status: "Pending",
      });
      timeslots.push(newTimeslot);
    }

    const savedTimeslots = await Timeslot.insertMany(timeslots);

    // Update the session with new timeslots
    session.timeslots = savedTimeslots.map((slot) => slot._id);
    await session.save();

    res.status(201).json({ message: "Timeslots generated successfully", timeslots: savedTimeslots });
  } catch (err) {
    console.error("Error generating timeslots:", err);
    res.status(500).json({ message: "Error generating timeslots", error: err.message });
  }
});

// 2. Assign Startups to Timeslots
router.post("/assign", authenticateToken, async (req, res) => {
  const { timeslotId, startupId, room, remoteRoom } = req.body;

  if (!isValidObjectId(timeslotId) || !isValidObjectId(startupId)) {
    return res.status(400).json({ message: "Invalid Timeslot or Startup ID" });
  }

  try {
    const timeslot = await Timeslot.findById(timeslotId);
    if (!timeslot) {
      return res.status(404).json({ message: "Timeslot not found" });
    }

    // Ensure the startup is not assigned to another timeslot at the same time
    const conflictingTimeslot = await Timeslot.findOne({
      startupId,
      startTime: { $lt: timeslot.endTime },
      endTime: { $gt: timeslot.startTime },
    });

    if (conflictingTimeslot) {
      return res.status(400).json({
        message: "Startup is already assigned to another timeslot during this period",
      });
    }

    timeslot.startupId = startupId;
    timeslot.room = room;
    timeslot.remoteRoom = remoteRoom;
    timeslot.status = "Pending";
    await timeslot.save();

    res.status(200).json({ message: "Startup assigned to timeslot successfully", timeslot });
  } catch (err) {
    console.error("Error assigning startup:", err);
    res.status(500).json({ message: "Error assigning startup", error: err.message });
  }
});

// 3. Fetch Timeslots by Session
router.get("/session/:sessionId", authenticateToken, async (req, res) => {
  const { sessionId } = req.params;

  if (!isValidObjectId(sessionId)) {
    return res.status(400).json({ message: "Invalid Session ID" });
  }

  try {
    const timeslots = await Timeslot.find({ sessionId })
      .populate("startupId", "name teamLeader email")
      .populate("sessionId", "startTime endTime");
    res.status(200).json({ timeslots });
  } catch (err) {
    console.error("Error fetching timeslots:", err);
    res.status(500).json({ message: "Error fetching timeslots", error: err.message });
  }
});

// 4. Validate Judge Availability
router.post("/validate-judge", authenticateToken, async (req, res) => {
  const { judgeId, startTime, endTime } = req.body;

  if (!isValidObjectId(judgeId)) {
    return res.status(400).json({ message: "Invalid Judge ID" });
  }

  try {
    const conflictingSession = await Session.findOne({
      judges: judgeId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (conflictingSession) {
      return res.status(400).json({
        message: "Judge is already assigned to another session during this period",
        conflictingSession,
      });
    }

    res.status(200).json({ message: "Judge is available for the given time" });
  } catch (err) {
    console.error("Error validating judge availability:", err);
    res.status(500).json({ message: "Error validating judge availability", error: err.message });
  }
});

module.exports = router;
