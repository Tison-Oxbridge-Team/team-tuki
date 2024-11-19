const mongoose = require('mongoose')

const criteriaSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the criterion
    weight: { type: Number, required: true, min: 0, max: 100 }, // Weight in percentage
    subquestions: {
        questions: [{ type: String, required: true }], // Subquestion text
        optional: { type: Boolean, default: false }, // Whether all subquestions are optional
    }})

module.exports = mongoose.model('Criteria', criteriaSchema)