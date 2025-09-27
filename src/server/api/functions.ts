import { auth } from "@clerk/nextjs/server";
import { Client } from "@googlemaps/google-maps-services-js";

export function checkAuth() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}