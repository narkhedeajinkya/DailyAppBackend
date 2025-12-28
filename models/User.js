// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  totalMana: { type: Number, default: 0 },
  pendingMana: {type: Number,default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
