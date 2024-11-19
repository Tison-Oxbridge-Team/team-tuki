const mongoose = require("mongoose");

const ResultsSchema = new mongoose.Schema({
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, // specifies the overall results of a specific round
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true }, // Link to the startup
  judgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Judge", required: true }, // Link to the judge
  averageScore: { type: Number, required: true }, // Calculated average score
  feedback: { type: String }, // Judge's feedback
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Results", ResultsSchema);
