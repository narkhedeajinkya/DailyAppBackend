const { today, yesterday } = require("./date");

const updateStreak = (task) => {
  // ✅ Always start with a return object
  let weeklyBonusTriggered = false;

  // ✅ Initialize streak if missing
  if (!task.streak) {
    task.streak = {
      current: 0,
      longest: 0,
      lastCompletedDate: null,
      mode: "strict"
    };
  }

  const last = task.streak.lastCompletedDate;

  // 🛑 Same day completion → no change, but still return object
  if (last === today()) {
    return { weeklyBonusTriggered };
  }

  if (!last) {
    task.streak.current = 1;
  } else if (last === yesterday()) {
    task.streak.current += 1;
  } else {
    // streak broken
    if (task.streak.mode === "strict") {
      task.streak.current = 1;
    } else {
      task.streak.current = Math.max(1, task.streak.current - 1);
    }
  }

  task.streak.longest = Math.max(
    task.streak.longest,
    task.streak.current
  );

  task.streak.lastCompletedDate = today();

  if (task.streak.current % 7 === 0) {
    weeklyBonusTriggered = true;
  }

  // ✅ ALWAYS return object
  return { weeklyBonusTriggered };
};

module.exports = { updateStreak };
