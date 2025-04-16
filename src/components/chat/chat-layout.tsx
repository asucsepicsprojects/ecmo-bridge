"use client";

import { useState } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";

export function ChatLayout() {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  return (
    <div className="flex h-[80vh] overflow-hidden rounded-md border bg-background">
      {/* Sidebar with chat rooms */}
      <div className="hidden w-64 border-r md:block">
        <ChatSidebar 
          activeRoomId={activeRoomId} 
          onRoomSelect={(roomId) => setActiveRoomId(roomId)} 
        />
      </div>
      
      {/* Chat window or welcome screen */}
      <div className="flex-1">
        {activeRoomId ? (
          <ChatWindow roomId={activeRoomId} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium">Welcome to ECMO Bridge Chat</h3>
              <p className="text-sm text-muted-foreground">
                Select a conversation from the sidebar or create a new one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 