"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { PlusIcon, MessageSquareIcon, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { NewChatForm } from "./new-chat-form";
import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChatSidebarProps {
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

export function ChatSidebar({ activeRoomId, onRoomSelect }: ChatSidebarProps) {
  const [openNewChat, setOpenNewChat] = useState(false);
  
  // Fetch chat rooms
  const { data: rooms, isLoading, error } = api.chat.getUserRooms.useQuery(
    undefined,
    {
      retry: 1,
      onError: (err) => {
        console.error("Failed to fetch rooms:", err);
      }
    }
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-sm font-semibold">Chat</h2>
        <Dialog open={openNewChat} onOpenChange={setOpenNewChat}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">New chat</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Conversation</DialogTitle>
            </DialogHeader>
            <NewChatForm 
              onSuccess={() => {
                setOpenNewChat(false);
                toast.success("Conversation created");
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm font-medium">Failed to load conversations</p>
              <p className="text-xs text-muted-foreground">
                Please try again later
              </p>
            </div>
          </div>
        ) : rooms && rooms.length > 0 ? (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li key={room.id || room._id}>
                <Button
                  variant={activeRoomId === (room.id || room._id) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onRoomSelect(room.id || room._id)}
                >
                  <MessageSquareIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">{room.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
            <MessageSquareIcon className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="text-xs text-muted-foreground">
                Start a new conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 