const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminAuth = require("../models/AdminAuth");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Session storage
const activeSessions = new Map(); // Key: admin ID, Value: JWT token

// 1. Register Admin
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the admin already exists
    const existingAdmin = await AdminAuth.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new admin
    const newAdmin = new AdminAuth({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully", admin: { name, email } });
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
});

// 2. Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await AdminAuth.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET);

    // Store the session
    activeSessions.set(admin._id.toString(), token);

    res.status(200).json({
      message: "Admin logged in successfully",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error("Error logging in admin:", err);
    res.status(500).json({ message: "Error logging in admin", error: err.message });
  }
});

// 3. Get Active Sessions
router.get("/sessions", authenticateToken, (req, res) => {
  try {
    const sessionList = Array.from(activeSessions.entries()).map(([id, token]) => ({
      adminId: id,
      token,
    }));
    res.status(200).json({ sessions: sessionList });
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ message: "Error fetching sessions", error: err.message });
  }
});

// 4. Logout Admin
router.post("/logout", authenticateToken, (req, res) => {
  const adminId = req.user.id;

  try {
    if (activeSessions.has(adminId)) {
      activeSessions.delete(adminId);
      return res.status(200).json({ message: "Admin logged out successfully" });
    }
    res.status(400).json({ message: "No active session found for this admin" });
  } catch (err) {
    console.error("Error logging out admin:", err);
    res.status(500).json({ message: "Error logging out admin", error: err.message });
  }
});

// 5. Get All Admins
router.get("/", authenticateToken, async (req, res) => {
  try {
    const admins = await AdminAuth.find().select("-password"); // Exclude passwords
    res.status(200).json({ admins });
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).json({ message: "Error fetching admins", error: err.message });
  }
});

// 6. Get Admin by ID
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await AdminAuth.findById(id).select("-password"); // Exclude password
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).json({ message: "Error fetching admin", error: err.message });
  }
});

// 7. Delete Admin
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await AdminAuth.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Remove session if it exists
    activeSessions.delete(id);

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ message: "Error deleting admin", error: err.message });
  }
});

module.exports = router;
