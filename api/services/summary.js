const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/feedback/summarize
router.post('/summarize', async (req, res) => {
    try {
        // Extract the Python backend URL and feedback from the request body
        const { feedback } = req.body;
        const pythonEndpoint = `${process.env.AI_ENDPOINT}/summarize_feedback`

        // Validate the request
        if (!pythonEndpoint) {
            return res.status(400).json({ error: 'Python endpoint URL is required.' });
        }

        if (!feedback || !Array.isArray(feedback)) {
            return res.status(400).json({ error: 'Feedback must be a non-empty array.' });
        }

        // Log the feedback being sent
        console.log('Sending feedback to Python:', feedback);

        // Send the feedback to the Python backend
        const response = await axios.post(pythonEndpoint, { feedback });

        // Log the response from Python
        console.log('Response from Python:', response.data);

        // Return the Python backend's response to the client
        res.status(200).json({
            message: 'Feedback summarized successfully.',
            summary: response.data,
        });
    } catch (err) {
        console.error('Error sending feedback to Python backend:', err.message);

        // Handle specific errors from Python or connection issues
        if (err.response) {
            return res.status(err.response.status).json({
                error: 'Python backend error.',
                details: err.response.data || err.response.statusText,
            });
        }

        // Handle other errors (e.g., network errors)
        res.status(500).json({
            error: 'An unexpected error occurred while communicating with the Python backend.',
            details: err.message,
        });
    }
});

module.exports = router;
