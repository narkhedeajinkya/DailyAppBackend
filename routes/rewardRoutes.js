// routes/rewardRoutes.js
const express = require("express");
const Reward = require("../models/Reward");
const Redemption = require("../models/Redemption");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const now = new Date();
  const day = now.getDate(); // 1–31

  // Allow only from 26th to 1st
  const isAllowedWindow = day >= 26 || day === 1;

  if (!isAllowedWindow) {
    return res.status(403).json({
      error: "Rewards can be added only between 26th and 1st of the month"
    });
  }

  let rewardMonth = now.toISOString().slice(0, 7);

  if (day >= 26) {
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);
    rewardMonth = nextMonth.toISOString().slice(0, 7);
  }

  const reward = await Reward.create({
    userId: req.user.id,
    title: req.body.title,
    manaCost: req.body.manaCost,
    month: rewardMonth
  });

  res.json(reward);
});


router.get("/", auth, async (req, res) => {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

  const rewards = await Reward.find({
    userId: req.user.id,
    month: { $lte: currentMonth }
  }).sort({ month: 1 });

  res.json(rewards);
});


router.post("/redeem", auth, async (req, res) => {
  const reward = await Reward.findById(req.body.rewardId);
  const user = await User.findById(req.user.id);

  if (user.totalMana < reward.manaCost)
    return res.status(400).json({ error: "Insufficient mana" });

  user.totalMana -= reward.manaCost;
  await user.save();

  const redemption = await Redemption.create({
    userId: user._id,
    rewardId: reward._id,
    manaSpent: reward.manaCost
  });

  res.json(redemption);
});

router.get("/history", auth, async (req, res) => {
  const { date } = req.query;

  const filter = { userId: req.user.id };

  if (date) {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59`);
    filter.redeemedAt = { $gte: start, $lte: end };
  }

  const history = await Redemption.find(filter)
    .populate("rewardId", "title manaCost")
    .sort({ redeemedAt: -1 });

  res.json(history);
});


module.exports = router;
