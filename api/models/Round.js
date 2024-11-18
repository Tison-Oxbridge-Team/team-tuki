const mongoose = require("mongoose");

const RoundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dates: [{ type: Date, required: true }], // Dates allocated to the round
  criteria: [
    {
      name: { type: String, required: true }, // Name of the criterion
      weight: { type: Number, required: true, min: 0, max: 100 }, // Weight in percentage
      subquestions: [
        {
          question: { type: String, required: true }, // Subquestion text
          optional: { type: Boolean, default: false }, // Whether the subquestion is optional
        },
      ],
    },
  ],
  settings: {
    allowMultipleJudges: { type: Boolean, default: true },
    enableNotifications: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Round", RoundSchema);
