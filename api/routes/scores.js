const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Score = require('../models/Score');
const { calculateAggregateScores } = require('../services/scoreService');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/scores - Submit Scores
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const {
        startupId,
        judgeId,
        roundId,
        problemScore,
        solutionScore,
        innovationScore,
        teamScore,
        businessModelScore,
        marketOpportunityScore,
        technicalFeasibilityScore,
        executionStrategyScore,
        pitchQualityScore,
        feedback,
        nominated,
        nominationReason,
    } = req.body;

    try {
        // Check if the score already exists
        const existingScore = await Score.findOne({ startupId, judgeId, roundId });
        if (existingScore) {
            return res.status(409).json({ message: 'Score already submitted for this startup.' });
        }

        // Save the new score
        const newScore = new Score({
            id: Math.random().toString(36).substr(2, 9),
            startupId,
            judgeId,
            roundId,
            problemScore,
            solutionScore,
            innovationScore,
            teamScore,
            businessModelScore,
            marketOpportunityScore,
            technicalFeasibilityScore,
            executionStrategyScore,
            pitchQualityScore,
            feedback,
            nominated,
            nominationReason,
        });

        await newScore.save();
        res.status(201).json({ message: 'Score submitted successfully', score: newScore });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting score', error: err.message });
    }
});

// GET /api/scores/startup/:id - Get Scores for a Startup
router.get('/startup/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    // // Validate ObjectId
    // if (!isValidObjectId(id)) {
    //     return res.status(400).json({ message: 'Invalid startup ID provided' });
    // }

    try {
        const scores = await Score.find({ startupId: id });
        if (!scores.length) {
            return res.status(404).json({ message: 'No scores found for this startup.' });
        }
        res.status(200).json({ scores });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching scores', error: err.message });
    }
});

// GET /api/scores/round/:id - Get Scores for a Round
router.get('/round/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    // // Validate ObjectId
    // if (!isValidObjectId(id)) {
    //     return res.status(400).json({ message: 'Invalid round ID provided' });
    // }

    try {
        const scores = await Score.find({ roundId: id });
        if (!scores.length) {
            return res.status(404).json({ message: 'No scores found for this round.' });
        }
        res.status(200).json({ scores });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching scores', error: err.message });
    }
});

// PUT /api/scores/:id - Update a Score
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid score ID provided' });
    }

    try {
        const updatedScore = await Score.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedScore) {
            return res.status(404).json({ message: 'Score not found' });
        }
        res.status(200).json({ message: 'Score updated successfully', score: updatedScore });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating score', error: err.message });
    }
});

// DELETE /api/scores/:id - Delete a Score
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid score ID provided' });
    }

    try {
        const deletedScore = await Score.findByIdAndDelete(id);
        if (!deletedScore) {
            return res.status(404).json({ message: 'Score not found' });
        }
        res.status(200).json({ message: 'Score deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting score', error: err.message });
    }
});

// GET /api/scores/aggregate - Aggregate Scores
router.get('/aggregate', authenticateToken, async (req, res) => {
    try {
        const aggregatedScores = await calculateAggregateScores();
        res.status(200).json({ aggregatedScores });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error aggregating scores', error: err.message });
    }
});

module.exports = router;
