"use client";

import PusherClient from "pusher-js";

// Initialize Pusher client
let pusher: PusherClient | undefined;

export function getPusherClient() {
  if (!pusher) {
    pusher = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "",
        forceTLS: true,
      }
    );
  }
  
  return pusher;
} 