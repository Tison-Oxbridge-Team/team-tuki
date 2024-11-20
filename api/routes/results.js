// const express = require("express");
// const router = express.Router();
// const Results = require("../models/Results");

// const { Parser } = require("json2csv");
// const fs = require("fs");
// const path = require("path");
// const { authenticateToken } = require("../middleware/authMiddleware");

// // Get Results by Round
// router.get("/round/:roundId", authenticateToken, async (req, res) => {
//   const { roundId } = req.params;

//   try {
//     const results = await Results.find({ roundId })
//       .populate("startupId", "name category")
//       .populate("judgeId", "name email");

//     if (!results.length) {
//       return res.status(404).json({ message: "No results found for this round" });
//     }

//     res.status(200).json({ results });
//   } catch (err) {
//     console.error("Error fetching results:", err);
//     res.status(500).json({ message: "Error fetching results", error: err.message });
//   }
// });
// // Query Top Startups
// router.get("/round/:roundId/top", authenticateToken, async (req, res) => {
//     const { roundId } = req.params;
//     const { limit = 5 } = req.query; // Default top 5 startups
  
//     try {
//       const topStartups = await Results.find({ roundId })
//         .sort({ averageScore: -1 }) // Sort by highest average score
//         .limit(Number(limit))
//         .populate("startupId", "name category");
  
//       if (!topStartups.length) {
//         return res.status(404).json({ message: "No results found for this round" });
//       }
  
//       res.status(200).json({ topStartups });
//     } catch (err) {
//       console.error("Error querying top startups:", err);
//       res.status(500).json({ message: "Error querying top startups", error: err.message });
//     }
//   });
//   const axios = require("axios");

//   // Generate AI Results
//   router.post("/round/:roundId/ai-insights", authenticateToken, async (req, res) => {
//     const { roundId } = req.params;
//     const { limit = 5 } = req.body;
  
//     try {
//       const topStartups = await Results.find({ roundId })
//         .sort({ averageScore: -1 })
//         .limit(Number(limit))
//         .populate("startupId", "name category");
  
//       if (!topStartups.length) {
//         return res.status(404).json({ message: "No results found for AI generation" });
//       }
  
//       // Prepare data for AI
//       const aiPayload = {
//         startups: topStartups.map((result) => ({
//           name: result.startupId.name,
//           category: result.startupId.category,
//           averageScore: result.averageScore,
//           feedback: result.feedback,
//         })),
//       };
  
//       // Send data to AI service
//       const aiResponse = await axios.post("https://ai-service.com/generate-insights", aiPayload);
  
//       res.status(200).json({ aiInsights: aiResponse.data });
//     } catch (err) {
//       console.error("Error generating AI insights:", err);
//       res.status(500).json({ message: "Error generating AI insights", error: err.message });
//     }
//   });

// // Export Results as CSV
// router.get("/round/:roundId/export/csv", authenticateToken, async (req, res) => {
//   const { roundId } = req.params;

//   try {
//     const results = await Results.find({ roundId })
//       .populate("startupId", "name category")
//       .populate("judgeId", "name email");

//     if (!results.length) {
//       return res.status(404).json({ message: "No results found to export" });
//     }

//     const data = results.map((result) => ({
//       Startup: result.startupId.name,
//       Category: result.startupId.category,
//       Judge: result.judgeId.name,
//       "Average Score": result.averageScore,
//       Feedback: result.feedback,
//     }));

//     const parser = new Parser();
//     const csv = parser.parse(data);

//     res.header("Content-Type", "text/csv");
//     res.attachment("results.csv");
//     res.send(csv);
//   } catch (err) {
//     console.error("Error exporting results as CSV:", err);
//     res.status(500).json({ message: "Error exporting results as CSV", error: err.message });
//   }
// });

// // Export Results as Word
// router.get("/round/:roundId/export/word", authenticateToken, async (req, res) => {
//   const { roundId } = req.params;

//   try {
//     const results = await Results.find({ roundId })
//       .populate("startupId", "name category")
//       .populate("judgeId", "name email");

//     if (!results.length) {
//       return res.status(404).json({ message: "No results found to export" });
//     }

//     const data = results.map((result) => `
//       Startup: ${result.startupId.name}
//       Category: ${result.startupId.category}
//       Judge: ${result.judgeId.name}
//       Average Score: ${result.averageScore}
//       Feedback: ${result.feedback}
//     `);

//     const filePath = path.join(__dirname, "../exports/results.docx");
//     fs.writeFileSync(filePath, data.join("\n\n"));

//     res.download(filePath, "results.docx");
//   } catch (err) {
//     console.error("Error exporting results as Word:", err);
//     res.status(500).json({ message: "Error exporting results as Word", error: err.message });
//   }
// });

// module.exports = router;