const mongoose = require('mongoose');

const ScoringWeightSchema = new mongoose.Schema({
    id: { type: String, required: true },
    roundId: { type: String, ref: 'Round', required: true },
    criteriaKey: { type: String, required: true },
    weight: { type: Number, required: true, min: 0, max: 100 },
    subCriteria: { type: mongoose.Schema.Types.Mixed }, // JSON object for sub-criteria
});

module.exports = mongoose.model('ScoringWeight', ScoringWeightSchema);
