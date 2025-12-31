const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { settleManaIfNeeded } = require("../utils/settleMana");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 🔥 LAZY DAILY MANA SETTLEMENT
    await settleManaIfNeeded(user);

    req.user = user; // attach full user
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
