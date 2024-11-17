const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    teamLead: { type: String, required: true },
    pitchTime: { type: Date, required: true },
    roundId: { type: String, ref: 'Round', required: true },
    status: { type: String, default: 'registered' }, // Example states: registered, scheduled, scored
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Startup', StartupSchema);
