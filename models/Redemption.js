// models/Redemption.js
const mongoose = require("mongoose");

const redemptionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  rewardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reward",
    required: true
  },
  manaSpent: Number,
  redeemedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Redemption", redemptionSchema);
