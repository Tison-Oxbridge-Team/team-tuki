const express = require('express');
const router = express.Router();
const Judge = require('../models/Judge');

// GET /api/judges - Fetch all judges
router.get('/', async (req, res) => {
    try {
        const judges = await Judge.find();
        res.status(200).json({ judges });
    } catch (error) {
        res.status(500).json({ message: "Error fetching judges", error: error.message });
    }
});

// POST /api/judges - Add a judge
router.post('/', async (req, res) => {
    const { idNo, name, email, status } = req.body;

    try {
        const newJudge = new Judge({ idNo, name, email, status });
        await newJudge.save();
        res.status(201).json(newJudge);
    } catch (error) {
        res.status(500).json({ message: "Error adding judge", error: error.message });
    }
});

// DELETE /api/judges/:id - Delete a judge
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJudge = await Judge.findByIdAndDelete(id);
        if (!deletedJudge) {
            return res.status(404).json({ message: "Judge not found" });
        }
        res.status(200).json({ message: "Judge deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting judge", error: error.message });
    }
});

module.exports = router;
