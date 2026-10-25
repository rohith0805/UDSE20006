import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Create backend/.env from .env.example.');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}
