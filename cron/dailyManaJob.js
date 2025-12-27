// cron/dailyManaJob.js
const cron = require("node-cron");
const DailyTask = require("../models/DailyTask");
const User = require("../models/User");

cron.schedule("59 23 * * *", async () => {
  const today = new Date().toISOString().slice(0,10);
  const tasks = await DailyTask.find({ date: today, status: "completed" });

  for (let t of tasks) {
    await User.findByIdAndUpdate(t.userId, {
      $inc: { totalMana: t.manaEarned }
    });
  }
});
