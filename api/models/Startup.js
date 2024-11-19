const mongoose = require("mongoose");

const StartupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamLeader: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  room: { type: String, required: false }, // Optional: Designated room  
  scores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Score" }], // Scoring information
  timeslot: { type: mongoose.Schema.Types.ObjectId, ref: "Score" }, // Timeslot a startup is assigned
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Startup", StartupSchema);
