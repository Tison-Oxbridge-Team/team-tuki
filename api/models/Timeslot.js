const mongoose = require("mongoose");

const TimeslotSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  room: { type: String, required: true }, // Assigned room
  remoteRoom: { type: String }, // Optional remote room
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Timeslot", TimeslotSchema);
