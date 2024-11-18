const mongoose = require("mongoose");

const StartupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamLeader: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pitchSchedule: { type: Date, required: false }, // Optional: Schedule for pitching
  // status: {
  //   type: String,
  //   enum: ["Pending", "In Progress", "Completed"],
  //   default: "Pending",
  // },
  room: { type: String, required: false }, // Optional: Designated room  
  scores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Score" }], // Scoring information
  // remoteRoom: { type: String, required: false }, // found specificcally on the time slot
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Startup", StartupSchema);
