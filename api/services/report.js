// /routes/feedback.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST route to submit feedback and get a summary
router.post('/submit-feedback', async (req, res) => {
    try {
        const { feedback } = req.body;

        if (!feedback) {
            return res.status(400).json({ error: "Feedback data is required." });
        }

        // Send feedback to Flask backend for summarization
        const response = await axios.post(`${process.env.AI_ENDPOINT}/report/generate_summary`, {
            feedback: feedback
        });

        // Send the summary received from Flask backend as a response
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return res.status(500).json({ error: "An error occurred while processing the feedback." });
    }
});

module.exports = router;
