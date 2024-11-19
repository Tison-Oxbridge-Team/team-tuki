const mongoose = require("mongoose");

const RoundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  criteria: [{type: mongoose.Schema.Types.ObjectId, ref: "Criteria"}], // Criteria used in the round
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }, // Schedule of the round, coz they canbe in several days
  settings: {
    enableNotifications: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});
module.exports = mongoose.model("Round", RoundSchema);



  // results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Results" }], // Results of the round