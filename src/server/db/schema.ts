import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: timestamp('date_of_birth'),
  gender: text('gender'),
  hospitalId: uuid('hospital_id'),
  status: text('status', { enum: ['Active', 'Inactive'] }),
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
  read: text('read').default('false'),
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