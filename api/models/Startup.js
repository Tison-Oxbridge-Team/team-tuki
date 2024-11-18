const mongoose = require("mongoose");

const StartupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamLeader: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pitchSchedule: { type: Date, required: false }, // Optional: Schedule for pitching
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  room: { type: String, required: false }, // Optional: Designated room
  remoteRoom: { type: String, required: false }, // Optional: Remote room
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Startup", StartupSchema);
