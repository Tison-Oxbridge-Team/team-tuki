const mongoose = require("mongoose");

const JudgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  expertise: { type: [String], required: true },
  // startupLoad: { type: Number, default: 0 },  Should be dynamiv and come from the timeslots(Since its where the startup is assigned)
  // assignedStartups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Startup" }],
  timeslots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Timeslot" }], // Timeslots assigned to the judge. Can help also finding the startup load
  createdAt: { type: Date, default: Date.now },
  password: { type: String, required: true }, // For login
});

module.exports = mongoose.model("Judge", JudgeSchema);
