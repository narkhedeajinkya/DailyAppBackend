const settleManaIfNeeded = async (user) => {
  const today = new Date().toISOString().slice(0, 10);

  // Already settled today → do nothing
  if (user.lastManaSettlement === today) return;

  // Perform settlement
  user.totalMana += user.pendingMana || 0;
  user.pendingMana = 0;
  user.lastManaSettlement = today;

  await user.save();
};

module.exports = { settleManaIfNeeded };
