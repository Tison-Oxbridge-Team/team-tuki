const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    id: { type: String, required: true },
    startupId: { type: String, ref: 'Startup', required: true },
    judgeId: { type: String, ref: 'User', required: true },
    roundId: { type: String, ref: 'Round', required: true },
    problemScore: { type: Number, min: 1, max: 5, required: true },
    solutionScore: { type: Number, min: 1, max: 5, required: true },
    innovationScore: { type: Number, min: 1, max: 5, required: true },
    teamScore: { type: Number, min: 1, max: 5, required: true },
    businessModelScore: { type: Number, min: 1, max: 5, required: true },
    marketOpportunityScore: { type: Number, min: 1, max: 5, required: true },
    technicalFeasibilityScore: { type: Number, min: 1, max: 5, required: true },
    executionStrategyScore: { type: Number, min: 1, max: 5, required: true },
    pitchQualityScore: { type: Number, min: 1, max: 5, required: true },
    feedback: { type: String },
    nominated: { type: Boolean, default: false },
    nominationReason: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Score', ScoreSchema);
