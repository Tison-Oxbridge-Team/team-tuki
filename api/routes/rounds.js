const express = require('express');
const router = express.Router();
const Round = require('../models/Round');
const ScoringWeight = require('../models/ScoringWeight');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
    const { id, name, stage, startTime, endTime } = req.body;

    try {
        // Validate input
        if (!id || !name || !stage || !startTime || !endTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create and save the round
        const newRound = new Round({ id, name, stage, startTime, endTime });
        await newRound.save();

        res.status(201).json({ message: 'Round created successfully', round: newRound });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating round', error: err.message });
    }
});
router.get('/', authenticateToken, async (req, res) => {
    try {
        const rounds = await Round.find();
        res.status(200).json({ rounds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching rounds', error: err.message });
    }
});
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const round = await Round.findOne({ id });
        if (!round) {
            return res.status(404).json({ message: 'Round not found' });
        }
        res.status(200).json({ round });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching round', error: err.message });
    }
});
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedRound = await Round.findOneAndUpdate({ id }, updates, { new: true });
        if (!updatedRound) {
            return res.status(404).json({ message: 'Round not found' });
        }
        res.status(200).json({ message: 'Round updated successfully', round: updatedRound });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating round', error: err.message });
    }
});
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRound = await Round.findOneAndDelete({ id });
        if (!deletedRound) {
            return res.status(404).json({ message: 'Round not found' });
        }
        res.status(200).json({ message: 'Round deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting round', error: err.message });
    }
});
router.post('/:id/weights', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { criteriaKey, weight, subCriteria } = req.body;

    try {
        // Validate input
        if (!criteriaKey || weight == null) {
            return res.status(400).json({ message: 'Criteria key and weight are required' });
        }

        // Save scoring weight
        const newWeight = new ScoringWeight({ id: Math.random().toString(36).substr(2, 9), roundId: id, criteriaKey, weight, subCriteria });
        await newWeight.save();

        res.status(201).json({ message: 'Scoring weight configured successfully', weight: newWeight });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error configuring scoring weight', error: err.message });
    }
});


module.exports = router