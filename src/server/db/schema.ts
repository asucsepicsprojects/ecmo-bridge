import { pgTable, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core';

// Hospitals table for storing hospital information
export const hospitals = pgTable('hospitals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk user ID
  name: text('name').notNull(),
  coordinates: text('coordinates'), // JSON string for lat/lng
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  hospitalId: uuid('hospital_id').references(() => hospitals.id),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  coordinates: text('coordinates'), // JSON string for lat/lng
  score: integer('score').notNull(),
  specialCare: text('special_care', { 
    enum: ['PEDIATRIC', 'FIRST_RESPONDERS', 'SINGLE_CARETAKERS', 'PREGNANT_PATIENTS', 'SHORT_TERM_SURVIVAL'] 
  }).notNull(),
  ecmoType: text('ecmo_type', { 
    enum: ['PULMONARY', 'CARDIAC', 'ECPR'] 
  }).notNull(),
  isMatched: boolean('is_matched').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Chat messages table for storing messages between users
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  senderId: text('sender_id').notNull(), // Clerk user ID
  receiverId: text('receiver_id'), // Optional: for direct messages between users
  roomId: text('room_id'), // For group chats or channels
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Chat rooms for organizing conversations
export const chatRooms = pgTable('chat_rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type', { enum: ['direct', 'group'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Many-to-many relationship between users and rooms
export const chatRoomParticipants = pgTable('chat_room_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').notNull(),
  userId: text('user_id').notNull(), // Clerk user ID
  joinedAt: timestamp('joined_at').defaultNow(),
}); 