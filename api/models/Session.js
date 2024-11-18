const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, //Which round the session is into
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Judge" }], // Assigned judges
  timeslots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Timeslot" }], // Associated timeslots
  slotDuration: { type: Number, required: true }, // Duration of each slot in minutes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", SessionSchema);
