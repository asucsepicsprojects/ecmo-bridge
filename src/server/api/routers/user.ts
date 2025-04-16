import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { checkAuth } from "../functions";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/lib/helpers";

export const userRouter = createTRPCRouter({
  // Get all users
  getAll: publicProcedure.query(async () => {
    try {
      const userId = checkAuth();
      
      // Get users from Clerk
      const users = await clerkClient.users.getUserList({
        limit: 100,
      });
      
      // Filter out sensitive information and the current user
      return users
        .filter(user => user.id !== userId)
        .map(user => filterUserForClient(user));
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
      });
    }
  }),
  
  // Search users by name or email
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      try {
        const userId = checkAuth();
        const { query } = input;
        
        if (!query.trim()) return [];
        
        // Get users from Clerk
        const users = await clerkClient.users.getUserList({
          limit: 100,
        });
        
        // Filter and search users
        return users
          .filter(user => user.id !== userId) // Exclude current user
          .filter(user => {
            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
            const email = user.emailAddresses[0]?.emailAddress?.toLowerCase() || "";
            const searchQuery = query.toLowerCase();
            
            return fullName.includes(searchQuery) || email.includes(searchQuery);
          })
          .map(user => filterUserForClient(user));
      } catch (error) {
        console.error("Failed to search users:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search users",
        });
      }
    }),
    
  // Get current user
  getCurrent: publicProcedure.query(async () => {
    try {
      const userId = checkAuth();
      
      const user = await clerkClient.users.getUser(userId);
      
      return filterUserForClient(user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user information",
      });
    }
  }),
}); 