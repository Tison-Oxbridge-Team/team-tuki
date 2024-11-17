const mongoose = require('mongoose');

const dotenv = require("dotenv")

dotenv.config()

MONGO = process.env.MONGO_URI
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
module.exports = { connectDB };
