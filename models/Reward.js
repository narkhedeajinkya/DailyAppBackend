// models/Reward.js
const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  manaCost: Number,
  month: String
}, { timestamps: true });

module.exports = mongoose.model("Reward", rewardSchema);
