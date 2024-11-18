const mongoose = require("mongoose");

const ResultsSchema = new mongoose.Schema({
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, // Link to the round
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true }, // Link to the startup
  judgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Judge", required: true }, // Link to the judge
  score: {
    type: Map,
    of: Number, // Map of criteria names to their scores
    required: true,
  },
  averageScore: { type: Number, required: true }, // Calculated average score
  feedback: { type: String }, // Judge's feedback
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Results", ResultsSchema);
