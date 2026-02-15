const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://nithyasridevi26_db_user:xtG2QgtrETEWdalu@cluster0.ultsjbw.mongodb.net/usernithya?appName=Cluster0');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
   
    process.exit(1);
  }
};

module.exports = connectDB;