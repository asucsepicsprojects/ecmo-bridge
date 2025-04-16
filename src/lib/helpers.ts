import { type User } from "@clerk/nextjs/server";

// Filter user for client to remove sensitive information
export function filterUserForClient(user: User) {
  return {
    id: user.id,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous User",
    email: user.emailAddresses[0]?.emailAddress,
    image: user.imageUrl,
    // Add other non-sensitive fields as needed
  };
} 