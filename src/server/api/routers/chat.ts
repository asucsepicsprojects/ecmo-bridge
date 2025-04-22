import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { checkAuth } from "../functions";
import { pusher } from "~/lib/pusher";
import mongoose from 'mongoose';
import connectMongoDB from "~/server/db/mongodb";
import { TRPCError } from "@trpc/server";

// Define MongoDB schemas for chat collections
const chatMessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String },
  roomId: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['direct', 'group'], default: 'group' },
  createdAt: { type: Date, default: Date.now },
});

const chatRoomParticipantSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
});

// Define interfaces for the models
interface IChatMessage {
  content: string;
  senderId: string;
  receiverId?: string;
  roomId: string;
  read: boolean;
  createdAt: Date;
  _id?: string;
  id?: string;
}

interface IChatRoom {
  name: string;
  type: 'direct' | 'group';
  createdAt: Date;
  _id?: string;
  id?: string;
}

interface IChatRoomParticipant {
  roomId: string;
  userId: string;
  joinedAt: Date;
  _id?: string;
  id?: string;
}

// Create or get existing models with proper TypeScript types
const ChatMessage = (mongoose.models.ChatMessage as mongoose.Model<IChatMessage>) || 
  mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

const ChatRoom = (mongoose.models.ChatRoom as mongoose.Model<IChatRoom>) || 
  mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);

const ChatRoomParticipant = (mongoose.models.ChatRoomParticipant as mongoose.Model<IChatRoomParticipant>) || 
  mongoose.model<IChatRoomParticipant>('ChatRoomParticipant', chatRoomParticipantSchema);

const messageSchema = z.object({
  content: z.string().min(1).max(1000),
  roomId: z.string(),
});

// Updated schema to match the new form requirements
const createRoomSchema = z.object({
  name: z.string().min(1, "Conversation name is required"),
  participantIds: z.array(z.string()).min(0),
  type: z.enum(["direct", "group"]).optional().default("group"),
});

// Ensure MongoDB connection is established before executing queries
async function ensureMongoConnection() {
  try {
    await connectMongoDB();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database connection failed",
    });
  }
}

export const chatRouter = createTRPCRouter({
  // Get messages for a room
  getMessages: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ input }) => {
      try {
        await ensureMongoConnection();
        const userId = checkAuth();
        
        // Check if user is in the room
        const participant = await ChatRoomParticipant.findOne({
          roomId: input.roomId,
          userId: userId,
        }).exec();
        
        if (!participant) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not a participant in this conversation",
          });
        }
        
        // Get messages
        const messages = await ChatMessage.find({
          roomId: input.roomId,
        })
          .sort({ createdAt: -1 })
          .limit(50)
          .exec();
        
        // Transform messages to include both _id and id for client compatibility
        const formattedMessages = messages.map(msg => {
          const msgObj = msg.toObject();
          return {
            ...msgObj,
            id: msgObj._id.toString(),
            createdAt: msgObj.createdAt.toISOString()
          };
        });
        
        return formattedMessages.reverse(); // Return in chronological order
      } catch (error) {
        console.error("Error fetching messages:", error);
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch messages. Please try again.",
        });
      }
    }),
  
  // Send a message
  sendMessage: publicProcedure
    .input(messageSchema)
    .mutation(async ({ input }) => {
      try {
        await ensureMongoConnection();
        const userId = checkAuth();
        
        // Check if user is in the room
        const participant = await ChatRoomParticipant.findOne({
          roomId: input.roomId,
          userId: userId,
        }).exec();
        
        if (!participant) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not a participant in this conversation",
          });
        }
        
        // Create the message
        const message = await ChatMessage.create({
          content: input.content,
          senderId: userId,
          roomId: input.roomId,
        });
        
        // Format the message for client
        const messageObj = message.toObject();
        const formattedMessage = {
          ...messageObj,
          id: messageObj._id.toString(),
          createdAt: messageObj.createdAt.toISOString()
        };
        
        // Trigger Pusher event
        await pusher.trigger(`chat-room-${input.roomId}`, "new-message", {
          message: formattedMessage,
        });
        
        return formattedMessage;
      } catch (error) {
        console.error("Error sending message:", error);
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message. Please try again.",
        });
      }
    }),
  
  // Create a new chat room
  createRoom: publicProcedure
    .input(createRoomSchema)
    .mutation(async ({ input }) => {
      try {
        await ensureMongoConnection();
        const userId = checkAuth();
        
        // Create the room
        const room = await ChatRoom.create({
          name: input.name,
          type: input.type || "group",
        });
        
        // Add participants to the room including the creator
        const participants = [userId, ...input.participantIds];
        
        // Ensure unique participants
        const uniqueParticipants = [...new Set(participants)];
        
        for (const participantId of uniqueParticipants) {
          await ChatRoomParticipant.create({
            roomId: room._id.toString(),
            userId: participantId,
          });
        }
        
        // Format the room for client
        const roomObj = room.toObject();
        return {
          ...roomObj,
          id: roomObj._id.toString(),
          createdAt: roomObj.createdAt.toISOString()
        };
      } catch (error) {
        console.error("Error creating chat room:", error);
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create conversation. Please try again.",
        });
      }
    }),
  
  // Get rooms for the current user
  getUserRooms: publicProcedure.query(async () => {
    try {
      await ensureMongoConnection();
      const userId = checkAuth();
      
      // Get the room IDs the user is a participant in
      const participations = await ChatRoomParticipant.find({
        userId: userId,
      }).exec();
      
      const roomIds = participations.map(p => p.roomId);
      
      if (roomIds.length === 0) {
        return [];
      }
      
      // Get the rooms
      const rooms = await ChatRoom.find({
        _id: { $in: roomIds },
      }).exec();
      
      // Format the rooms for client
      return rooms.map(room => {
        const roomObj = room.toObject();
        return {
          ...roomObj,
          id: roomObj._id.toString(),
          createdAt: roomObj.createdAt.toISOString()
        };
      });
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      if (error instanceof TRPCError) throw error;
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", 
        message: "Failed to fetch conversations. Please try again.",
      });
    }
  }),
}); 