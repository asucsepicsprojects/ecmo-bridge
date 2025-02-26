import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get MongoDB URI from environment variables with fallback
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless environments.
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
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable command buffering
      serverSelectionTimeoutMS: 5000, // Reduce server selection timeout
      socketTimeoutMS: 45000, // Increase socket timeout
      maxPoolSize: 10, // Limit connection pool size
      connectTimeoutMS: 10000, // Increase connection timeout
      retryWrites: true,
      w: 'majority'
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB Connected Successfully');
        return mongoose.connection;
      })
      .catch((error) => {
        console.error('❌ MongoDB Connection Error:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

// Example schema for reference
export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
}); 