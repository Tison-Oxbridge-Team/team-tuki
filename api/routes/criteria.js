// const express = require("express");
// const multer = require("multer");
// const csv = require("csv-parser");
// const fs = require("fs");
// const Criteria = require("../models/Criteria");
// const { authenticateToken } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Set up Multer for file uploads
// const upload = multer({ dest: "uploads/" });

// // 1. Create Criteria
// router.post("/", authenticateToken, async (req, res) => {
//   const { name, weight, subquestions } = req.body;

//   try {
//     const newCriteria = new Criteria({
//       name,
//       weight,
//       subquestions,
//     });

//     const savedCriteria = await newCriteria.save();
//     res.status(201).json({ message: "Criteria created successfully", criteria: savedCriteria });
//   } catch (err) {
//     console.error("Error creating criteria:", err);
//     res.status(500).json({ message: "Error creating criteria", error: err.message });
//   }
// });

// // 2. Fetch All Criteria
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     const criteria = await Criteria.find();
//     res.status(200).json({ criteria });
//   } catch (err) {
//     console.error("Error fetching criteria:", err);
//     res.status(500).json({ message: "Error fetching criteria", error: err.message });
//   }
// });

// // 3. Fetch Criteria by ID
// router.get("/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const criteria = await Criteria.findById(id);
//     if (!criteria) {
//       return res.status(404).json({ message: "Criteria not found" });
//     }

//     res.status(200).json({ criteria });
//   } catch (err) {
//     console.error("Error fetching criteria:", err);
//     res.status(500).json({ message: "Error fetching criteria", error: err.message });
//   }
// });

// // 4. Update Criteria
// router.put("/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   try {
//     const updatedCriteria = await Criteria.findByIdAndUpdate(id, updates, { new: true });
//     if (!updatedCriteria) {
//       return res.status(404).json({ message: "Criteria not found" });
//     }

//     res.status(200).json({ message: "Criteria updated successfully", criteria: updatedCriteria });
//   } catch (err) {
//     console.error("Error updating criteria:", err);
//     res.status(500).json({ message: "Error updating criteria", error: err.message });
//   }
// });

// // 5. Delete Criteria
// router.delete("/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedCriteria = await Criteria.findByIdAndDelete(id);
//     if (!deletedCriteria) {
//       return res.status(404).json({ message: "Criteria not found" });
//     }

//     res.status(200).json({ message: "Criteria deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting criteria:", err);
//     res.status(500).json({ message: "Error deleting criteria", error: err.message });
//   }
// });

// // 6. Bulk Import Criteria via CSV
// router.post("/import", authenticateToken, upload.single("file"), async (req, res) => {
//   const filePath = req.file.path;

//   try {
//     const criteriaList = [];

//     // Read CSV file
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (row) => {
//         const { name, weight, subquestions } = row;
//         criteriaList.push({
//           name,
//           weight: parseFloat(weight),
//           subquestions: {
//             questions: subquestions.split(";"),
//             optional: false,
//           },
//         });
//       })
//       .on("end", async () => {
//         // Save criteria in bulk
//         await Criteria.insertMany(criteriaList);
//         fs.unlinkSync(filePath); // Delete the uploaded file
//         res.status(200).json({ message: "Criteria imported successfully", criteria: criteriaList });
//       });
//   } catch (err) {
//     console.error("Error importing criteria:", err);
//     fs.unlinkSync(filePath); // Delete the uploaded file in case of error
//     res.status(500).json({ message: "Error importing criteria", error: err.message });
//   }
// });

// module.exports = router;
