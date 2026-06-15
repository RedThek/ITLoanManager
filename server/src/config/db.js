// Charger les variables d'environnement
import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL || 5000;

    const conn = await mongoose.connect(mongoURI);
    console.log('Successfully connected to MongoDB 7 via Mongoose.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Stop the server on connection failure
  }
};

// Exportation uniforme pour le reste de l'application
//export default { mongoose };