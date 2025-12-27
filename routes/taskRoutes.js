// routes/taskRoutes.js
const express = require("express");
const Task = require("../models/Task");
const DailyTask = require("../models/DailyTask");
const auth = require("../middleware/authMiddleware");
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
  const task = await DailyTask.findById(req.params.id);
  task.status = "completed";
  await task.save();
  res.json(task);
});

router.get("/today", auth, async (req, res) => {
  const today = new Date().toISOString().slice(0,10);
  const tasks = await DailyTask.find({ userId: req.user.id, date: today });
  res.json(tasks);
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
