const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, required: true }, // Physical room
  remoteRoom: { type: String }, // Optional remote link
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Judge" }], // Assigned judges
  timeslots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Timeslot" }], // Associated timeslots
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", SessionSchema);
