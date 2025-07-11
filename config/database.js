const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Error trying to connect to MongoDB', err);
        process.exit(1);
    }
};

module.exports = connectDB;

