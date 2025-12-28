const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    mana: {
      type: Number,
      required: true
    },

    // 🔥 STREAK SYSTEM
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastCompletedDate: {
        type: String // YYYY-MM-DD
      },
      mode: {
        type: String,
        enum: ["strict", "soft"],
        default: "strict"
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
