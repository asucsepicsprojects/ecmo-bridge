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
      const usersResponse = await clerkClient.users.getUserList({
        limit: 100,
      });
      
      // Extract the users array from the response
      const users = usersResponse.data || [];
      
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
  
  // Search users by name or email (returns all users if query is empty)
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      try {
        const userId = checkAuth();
        const { query } = input;
        
        // Get users from Clerk
        const usersResponse = await clerkClient.users.getUserList({
          limit: 100,
        });
        
        // Extract the users array from the response
        const users = usersResponse.data || [];
        
        // Filter out current user
        const filteredUsers = users.filter(user => user.id !== userId);
        
        // If no query, return all users
        if (!query.trim()) {
          return filteredUsers.map(user => filterUserForClient(user));
        }
        
        // Filter and search users based on query
        const searchQuery = query.toLowerCase();
        return filteredUsers
          .filter(user => {
            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
            const email = user.emailAddresses[0]?.emailAddress?.toLowerCase() || "";
            
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