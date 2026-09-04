const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/manabu_db'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Force Mongoose to sync and update schema indexes (removes old slug_1 index)
    const Festival = require('../models/Festival');
    await Festival.syncIndexes();
    console.log('Database indexes synchronized successfully.');
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;