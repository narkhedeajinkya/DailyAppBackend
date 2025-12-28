const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "mana_app"
  });
  console.log("MongoDB connected");
};

module.exports = connectDB;

