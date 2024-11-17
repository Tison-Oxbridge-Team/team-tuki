const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Startup = require('../models/Startup');

// Middleware for authentication (if required)
const { authenticateToken } = require('../middleware/authMiddleware');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/startups/import
// Bulk import startups
router.post('/import', authenticateToken, async (req, res) => {
    const startups = req.body; // Array of startups

    try {
        // Validate input
        if (!Array.isArray(startups)) {
            return res.status(400).json({ message: 'Invalid data format. Expecting an array.' });
        }

        // Validate each startup object for required fields
        const invalidEntries = startups.filter(
            (startup) => !startup.name || !startup.category || !startup.teamLead
        );
        if (invalidEntries.length > 0) {
            return res.status(400).json({
                message: 'Some startup entries are invalid.',
                invalidEntries,
            });
        }

        // Insert startups into the database
        const createdStartups = await Startup.insertMany(startups);
        res.status(201).json({ message: 'Startups imported successfully', startups: createdStartups });
    } catch (err) {
        console.error('Error importing startups:', err);
        res.status(500).json({ message: 'Error importing startups', error: err.message });
    }
});

// GET /api/startups
// Get all startups
router.get('/', authenticateToken, async (req, res) => {
    try {
        const startups = await Startup.find();
        res.status(200).json({ startups });
    } catch (err) {
        console.error('Error fetching startups:', err);
        res.status(500).json({ message: 'Error fetching startups', error: err.message });
    }
});

// GET /api/startups/:id
// Get a single startup by ID
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ObjectId provided' });
    }

    try {
        const startup = await Startup.findById(id);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        res.status(200).json({ startup });
    } catch (err) {
        console.error('Error fetching startup:', err);
        res.status(500).json({ message: 'Error fetching startup', error: err.message });
    }
});

// PUT /api/startups/:id
// Update startup information
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    let updates = req.body; // Fields to update

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ObjectId provided' });
    }

    try {
        // Log the incoming update payload
        console.log('Original updates:', updates);

        // Create a filtered updates object that excludes restricted fields
        const allowedFields = ['name', 'category', 'teamLead', 'pitchTime', 'roundId'];
        const filteredUpdates = Object.keys(updates).reduce((filtered, key) => {
            if (allowedFields.includes(key)) {
                filtered[key] = updates[key];
            }
            return filtered;
        }, {});

        // Log the filtered updates
        console.log('Filtered updates:', filteredUpdates);

        // Perform the update
        const updatedStartup = await Startup.findByIdAndUpdate(id, filteredUpdates, { new: true });
        if (!updatedStartup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        res.status(200).json({ message: 'Startup updated successfully', startup: updatedStartup });
    } catch (err) {
        console.error('Error updating startup:', err);
        res.status(500).json({ message: 'Error updating startup', error: err.message });
    }
});

// DELETE /api/startups/:id
// Delete a startup by ID
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ObjectId provided' });
    }

    try {
        const deletedStartup = await Startup.findByIdAndDelete(id);
        if (!deletedStartup) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        res.status(200).json({ message: 'Startup deleted successfully' });
    } catch (err) {
        console.error('Error deleting startup:', err);
        res.status(500).json({ message: 'Error deleting startup', error: err.message });
    }
});

module.exports = router;
