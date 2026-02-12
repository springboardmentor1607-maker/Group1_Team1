const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cleanstreet');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
   
    process.exit(1);
  }
};

module.exports = connectDB;