const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, // Link to the round
  date: { type: Date, required: true }, // Date of the session
  sessions: [
    {
      startTime: { type: Date, required: true }, // Session start time
      endTime: { type: Date, required: true }, // Session end time
      judges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Judge", required: true }], // Assigned judges
      slotDuration: { type: Number, required: true }, // Duration of each slot in minutes
      slots: [
        {
          startTime: { type: Date, required: true }, // Slot start time
          endTime: { type: Date, required: true }, // Slot end time
          assignedStartup: { type: mongoose.Schema.Types.ObjectId, ref: "Startup" }, // Assigned startup
          room: { type: String }, // Physical room
          remoteRoom: { type: String }, // Remote room link
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
