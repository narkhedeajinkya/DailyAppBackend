// routes/taskRoutes.js
const express = require("express");
const Task = require("../models/Task");
const DailyTask = require("../models/DailyTask");
const User = require("../models/User"); 
const auth = require("../middleware/authMiddleware");
const { updateStreak } = require("../utils/streak");
const router = express.Router();


router.post("/", auth, async (req, res) => {
  const task = await Task.create({
    userId: req.user.id,
    title: req.body.title,
    mana: req.body.mana
  });
  res.json(task);
});

router.post("/assign", auth, async (req, res) => {
  const { taskId, date } = req.body;
  const task = await Task.findById(taskId);

  const daily = await DailyTask.create({
    userId: req.user.id,
    taskId,
    date,
    manaEarned: task.mana
  });

  res.json(daily);
});

router.patch("/:id/complete", auth, async (req, res) => {
  const dailyTask = await DailyTask.findById(req.params.id);
  if (!dailyTask) {
    return res.status(404).json({ error: "Daily task not found" });
  }

  dailyTask.status = "completed";
  const task = await Task.findById(dailyTask.taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const { weeklyBonusTriggered } = updateStreak(task);
  if (typeof user.pendingMana !== "number") {
    user.pendingMana = 0;
  }
  const baseMana = Number(task.mana) || 0;
  user.pendingMana += baseMana;

  if (weeklyBonusTriggered) {
    user.pendingMana += baseMana * 2;
  }
+  await dailyTask.save();
  await task.save();
  await user.save();

  res.json({
    dailyTask,
    weeklyBonusTriggered,
    pendingMana: user.pendingMana
  });
});


router.get("/today", auth, async (req, res) => {
  try {
    const userId = req.user.id; 
    const today = new Date().toISOString().slice(0, 10);

    const tasks = await DailyTask.find({ userId, date: today })
      .populate({
        path: "taskId",
        select: "title mana streak"
      });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load tasks" });
  }
});


router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

router.get("/history", auth, async (req, res) => {
  const { date } = req.query;

  const filter = { userId: req.user.id };
  if (date) {
    filter.date = date;
  }

  const tasks = await DailyTask.find(filter)
    .populate("taskId", "title mana")
    .sort({ date: -1 });

  res.json(tasks);
});


module.exports = router;
