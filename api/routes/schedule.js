// const express = require("express");
// const router = express.Router();
// const Schedule = require("../models/Schedule");
// const Round = require("../models/Round");
// const { authenticateToken } = require("../middleware/authMiddleware");

// // Create a Schedule
// router.post("/", authenticateToken, async (req, res) => {
//   const { roundId, date, sessions } = req.body;

//   try {
//     // Ensure round exists
//     const round = await Round.findById(roundId);
//     if (!round) {
//       return res.status(404).json({ message: "Round not found" });
//     }

//     // Calculate time slots for each session
//     const updatedSessions = sessions.map((session) => {
//       const { startTime, endTime, slotDuration, judges } = session;

//       const slots = [];
//       let currentStartTime = new Date(startTime);

//       while (currentStartTime < new Date(endTime)) {
//         const currentEndTime = new Date(currentStartTime.getTime() + slotDuration * 60000); // Add slot duration
//         if (currentEndTime > new Date(endTime)) break;

//         slots.push({
//           startTime: currentStartTime,
//           endTime: currentEndTime,
//         });

//         currentStartTime = currentEndTime;
//       }

//       return { ...session, slots };
//     });

//     // Save schedule
//     const newSchedule = new Schedule({ roundId, date, sessions: updatedSessions });
//     const savedSchedule = await newSchedule.save();

//     res.status(201).json({ message: "Schedule created successfully", schedule: savedSchedule });
//   } catch (err) {
//     console.error("Error creating schedule:", err);
//     res.status(500).json({ message: "Error creating schedule", error: err.message });
//   }
// });
// // Get All Schedules
// router.get("/", authenticateToken, async (req, res) => {
//     try {
//       const schedules = await Schedule.find().populate("roundId", "name").populate("sessions.judges", "name email");
//       res.status(200).json({ schedules });
//     } catch (err) {
//       console.error("Error fetching schedules:", err);
//       res.status(500).json({ message: "Error fetching schedules", error: err.message });
//     }
//   });
// // Get Schedules by Round ID
// router.get("/round/:roundId", authenticateToken, async (req, res) => {
//     const { roundId } = req.params;
  
//     try {
//       const schedules = await Schedule.find({ roundId }).populate("sessions.judges", "name email");
//       if (!schedules.length) {
//         return res.status(404).json({ message: "No schedules found for this round" });
//       }
  
//       res.status(200).json({ schedules });
//     } catch (err) {
//       console.error("Error fetching schedules:", err);
//       res.status(500).json({ message: "Error fetching schedules", error: err.message });
//     }
//   });
// // Update a Schedule
// router.put("/:id", authenticateToken, async (req, res) => {
//     const { id } = req.params;
//     const updates = req.body;
  
//     try {
//       const updatedSchedule = await Schedule.findByIdAndUpdate(id, updates, { new: true });
//       if (!updatedSchedule) {
//         return res.status(404).json({ message: "Schedule not found" });
//       }
  
//       res.status(200).json({ message: "Schedule updated successfully", schedule: updatedSchedule });
//     } catch (err) {
//       console.error("Error updating schedule:", err);
//       res.status(500).json({ message: "Error updating schedule", error: err.message });
//     }
//   });
//       // Delete a Schedule
// router.delete("/:id", authenticateToken, async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       const deletedSchedule = await Schedule.findByIdAndDelete(id);
//       if (!deletedSchedule) {
//         return res.status(404).json({ message: "Schedule not found" });
//       }
  
//       res.status(200).json({ message: "Schedule deleted successfully" });
//     } catch (err) {
//       console.error("Error deleting schedule:", err);
//       res.status(500).json({ message: "Error deleting schedule", error: err.message });
//     }
//   });

//   module.exports = router