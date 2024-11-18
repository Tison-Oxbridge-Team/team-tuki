const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()

// Replace with your JWT secret from your environment or config
const JWTSECRET = process.env.JWT_SECRET;

// Create an admin payload
const adminPayload = {
    id: "673a66b7c9a23949df68d020", // Replace with your admin's MongoDB ObjectId
    name: "Admin User",
    role: "admin",
};

// Generate the token
const token = jwt.sign(adminPayload, JWTSECRET);

console.log("Generated Admin Token:", token);
