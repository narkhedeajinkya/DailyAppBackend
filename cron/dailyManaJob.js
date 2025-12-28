// cron/dailyManaJob.js
const cron = require("node-cron");
const User = require("../models/User");

cron.schedule("59 23 * * *", async () => {
  try {
    const users = await User.find({ pendingMana: { $gt: 0 } });

    for (const user of users) {
      user.totalMana += user.pendingMana;
      user.pendingMana = 0;
      await user.save();
    }

    console.log("✅ Daily mana settlement completed");
  } catch (err) {
    console.error("❌ Daily mana settlement failed", err);
  }
});
