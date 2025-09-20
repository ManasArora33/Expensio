// Import mongoose
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose');
// MongoDB connection URL - change 'expensio' to your database name
const mongoURI = process.env.MONGO_URI;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Export the connectDB function
module.exports = connectDB;
