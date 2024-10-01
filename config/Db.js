require('dotenv').config();
const mongoose = require('mongoose');

const dbConnect = async () => {
  
  try {
    await mongoose.connect(process.env.DB_STRING);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = dbConnect;