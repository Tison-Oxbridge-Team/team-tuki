const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, // Link to the round
  date: { type: Date, required: true }, // Date of the session  
  startTime: { type: Date, required: true }, // Slot start time
  endTime: { type: Date, required: true }, // Slot end time
  sessionDuration: { type: Number, required: true }, // Duration of each session in minutes
  sessions : [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }], // Associated sessions
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);