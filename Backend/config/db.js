const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI ||
      "mongodb+srv://nithyasridevi26_db_user:xtG2QgtrETEWdalu@cluster0.ultsjbw.mongodb.net/usernithya?retryWrites=true&w=majority";

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
