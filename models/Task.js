// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  mana: Number
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
