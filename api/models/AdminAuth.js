const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminAuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" }, // Default role is admin
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});


module.exports = mongoose.model("AdminAuth", AdminAuthSchema);
