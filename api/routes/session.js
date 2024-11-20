// const express = require("express");
// const mongoose = require("mongoose");
// const Session = require("../models/Session");
// const Schedule = require("../models/Schedule");
// const Timeslot = require("../models/Timeslot");
// const Judge = require("../models/Judge");
// const Startup = require("../models/Startup");
// const { authenticateToken } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Helper function to validate ObjectId
// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// // 1. Create a Session
// router.post("/", authenticateToken, async (req, res) => {
//   const { scheduleId, roundId, startTime, endTime, judges, slotDuration } = req.body;

//   try {
//     if (!isValidObjectId(scheduleId)) {
//       return res.status(400).json({ message: "Invalid Schedule ID" });
//     }

//     // Ensure at least 3 judges are assigned
//     if (judges.length < 3) {
//       return res.status(400).json({ message: "A minimum of 3 judges is required" });
//     }

//     // Validate judges' availability
//     const judgeLoadChecks = await Promise.all(
//       judges.map(async (judgeId) => {
//         const judge = await Judge.findById(judgeId);
//         return judge && judge.startupLoad > 0;
//       })
//     );
//     const overLoaded = judgeLoadChecks.some((load) => load);
//     if (overLoaded) {
//       return res.status(400).json({ message: "One or more judges are already assigned" });
//     }

//     // Create the session
//     const newSession = new Session({
//       scheduleId,
//       roundId,
//       startTime,
//       endTime,
//       judges,
//       slotDuration,
//     });

//     const savedSession = await newSession.save();

//     // Update the schedule to include this session
//     const schedule = await Schedule.findById(scheduleId);
//     schedule.sessions.push(savedSession._id);
//     await schedule.save();

//     res.status(201).json({ message: "Session created successfully", session: savedSession });
//   } catch (err) {
//     console.error("Error creating session:", err);
//     res.status(500).json({ message: "Error creating session", error: err.message });
//   }
// });

// // 2. Fetch All Sessions
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     const sessions = await Session.find()
//       .populate("scheduleId", "date")
//       .populate("judges", "name email")
//       .populate("timeslots", "startupId startTime endTime room");
//     res.status(200).json({ sessions });
//   } catch (err) {
//     console.error("Error fetching sessions:", err);
//     res.status(500).json({ message: "Error fetching sessions", error: err.message });
//   }
// });

// // 3. Fetch Session by ID
// router.get("/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;

//   if (!isValidObjectId(id)) {
//     return res.status(400).json({ message: "Invalid Session ID" });
//   }

//   try {
//     const session = await Session.findById(id)
//       .populate("scheduleId", "date")
//       .populate("judges", "name email")
//       .populate({
//         path: "timeslots",
//         populate: { path: "startupId", select: "name teamLeader email" },
//       });
//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     res.status(200).json({ session });
//   } catch (err) {
//     console.error("Error fetching session:", err);
//     res.status(500).json({ message: "Error fetching session", error: err.message });
//   }
// });

// // 4. Update Session
// router.put("/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   if (!isValidObjectId(id)) {
//     return res.status(400).json({ message: "Invalid Session ID" });
//   }

//   try {
//     const updatedSession = await Session.findByIdAndUpdate(id, updates, { new: true });
//     if (!updatedSession) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     res.status(200).json({ message: "Session updated successfully", session: updatedSession });
//   } catch (err) {
//     console.error("Error updating session:", err);
//     res.status(500).json({ message: "Error updating session", error: err.message });
//   }
// });

// // 5. Delete Session
// router.delete("/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;

//   if (!isValidObjectId(id)) {
//     return res.status(400).json({ message: "Invalid Session ID" });
//   }

//   try {
//     const deletedSession = await Session.findByIdAndDelete(id);
//     if (!deletedSession) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     // Optionally delete related timeslots
//     await Timeslot.deleteMany({ sessionId: id });

//     res.status(200).json({ message: "Session deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting session:", err);
//     res.status(500).json({ message: "Error deleting session", error: err.message });
//   }
// });

// // 6. Bulk Import Sessions via CSV
// router.post("/import", authenticateToken, async (req, res) => {
//   // Bulk import logic for sessions using CSV
//   res.status(501).json({ message: "Feature under development" });
// });

// module.exports = router;
