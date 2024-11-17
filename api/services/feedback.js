// routes/feedback.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint to send judge feedback to the Python backend
router.post('/submit-feedback', async (req, res) => {
    try {
        // Extract data from the incoming request
        const { startup_data, judge_feedback } = req.body;

        // Validate that both pieces of data are provided
        if (!startup_data || !judge_feedback) {
            return res.status(400).json({ error: "Startup data and judge feedback are required." });
        }

        // Send the data to the Python backend API
        const response = await axios.post(`${process.env.AI_ENDPOINT}/feedback_processor/process_feedback`, {            
            startup_data: startup_data,
            judge_feedback: judge_feedback
        });

        // Return the response from the Python backend
        res.status(200).json(response.data);
    } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing the feedback." });
    }
});

module.exports = router;
