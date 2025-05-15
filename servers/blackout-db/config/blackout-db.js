require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log(" Connecting to MongoDB with URI:", uri); // ← debug here

  if (!uri) {
    console.error(" MONGO_URI not defined in environment!");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(" Connected to MongoDB!");
  } catch (err) {
    console.error(" Connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;