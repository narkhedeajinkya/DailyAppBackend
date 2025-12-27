// models/DailyTask.js
const mongoose = require("mongoose");

const dailyTaskSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  date: String,
  status: { type: String, default: "pending" },
  manaEarned: Number
});

module.exports = mongoose.model("DailyTask", dailyTaskSchema);
