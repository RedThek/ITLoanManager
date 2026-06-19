// Charger les variables d'environnement
import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL || process.env.DATABASE_URL || 'mongodb://localhost:27017/gpmit';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000
      }
    );
    console.log('Successfully connected to MongoDB via Mongoose.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};