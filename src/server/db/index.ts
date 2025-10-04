import mongoose from 'mongoose';
import connectMongoDB from "./mongodb";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '~/env';
import * as schema from './schema';

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

// Create postgres connection if DATABASE_URL exists
let db: ReturnType<typeof drizzle> | undefined;
try {
  // Only initialize postgres if DATABASE_URL is defined
  if (process.env.DATABASE_URL) {
    const connectionString = process.env.DATABASE_URL;
    const client = postgres(connectionString, { ssl: true });
    
    // Create drizzle instance
    db = drizzle(client, { schema });
    console.log('✅ Drizzle database connection initialized');
  } else {
    console.warn('⚠️ DATABASE_URL not found in environment variables. Postgres connection not initialized.');
    console.warn('⚠️ Some tRPC endpoints may not work without a database connection.');
  }
} catch (error) {
  console.error('❌ Failed to establish Postgres connection:', error);
  db = undefined;
}

export { db };
