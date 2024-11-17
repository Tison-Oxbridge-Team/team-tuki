const mongoose = require('mongoose');

const JudgeSchema = new mongoose.Schema({
    idNo: { type: String, unique: true, required: true }, // ID number
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    status: { type: String, enum: ["Assigned", "Unassigned", "Unavailable"], default: "Unassigned" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Judge', JudgeSchema);
