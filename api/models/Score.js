const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  judgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Judge", required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true },
  criteriaScores: [
    {
      criterionId: { type: mongoose.Schema.Types.ObjectId, ref: "Criterion", required: true },
      score: { type: Number, required: true, min: 1, max: 5 },
      subScores: [{ type: Number, min: 1, max: 5 }], // Scores for sub-questions
    },
  ],
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Score", ScoreSchema);

//Check on the criteria scores.. 