const mongoose = require('mongoose');


const RoundSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    stage: { type: String, enum: ['screening', 'semifinal', 'final'], required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Round', RoundSchema);
