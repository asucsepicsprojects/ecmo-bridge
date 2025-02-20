import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get MongoDB URI from environment variables with fallback
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents creating multiple connections.
 */
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

const globalAny = global as unknown as { mongoose: MongooseCache };

let cached = globalAny.mongoose;

if (!cached) {
  cached = globalAny.mongoose = { conn: null, promise: null };
}

export default async function connectMongoDB() {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Example schema for reference
export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
}); 