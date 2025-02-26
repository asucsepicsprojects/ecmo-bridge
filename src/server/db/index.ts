import mongoose from 'mongoose';
import connectMongoDB from "./mongodb";

// MongoDB Connection
async function initMongoConnection() {
  try {
    const connection = await connectMongoDB();
    return connection;
  } catch (error) {
    console.error('❌ Failed to establish MongoDB connection:', error);
    return null;
  }
}

export const mongoClient = initMongoConnection();

export async function testMongoDBConnection() {
  try {
    const connection = await mongoClient;
    if (connection) {
      console.log('✅ MongoDB connection successful');
      return true;
    } else {
      console.error('❌ MongoDB connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    return false;
  }
}
