const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Falls back to 'mongodb' service name used in docker-compose.yml
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://mongodb:27017/manabu_db'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
