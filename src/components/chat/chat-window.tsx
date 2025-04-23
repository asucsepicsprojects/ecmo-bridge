"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { SendIcon, Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { getPusherClient } from "~/lib/pusher-client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Avatar } from "~/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ChatWindowProps {
  roomId: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  createdAt: Date;
}

export function ChatWindow({ roomId }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  
  // Fetch messages
  const { data, isLoading, error } = api.chat.getMessages.useQuery(
    { roomId },
    {
      enabled: !!roomId,
      retry: false,
    }
  );
  
  // Update messages when data changes
  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);
  
  // Send message mutation
  const sendMessageMutation = api.chat.sendMessage.useMutation({
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: (data) => {
      setMessage("");
      setIsSubmitting(false);
      if (data) {
        // Optimistically add the message locally to avoid waiting for Pusher
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
  
  // Listen for new messages via Pusher
  useEffect(() => {
    if (!roomId) return;
    
    try {
      const pusher = getPusherClient();
      const channel = pusher.subscribe(`chat-room-${roomId}`);
      
      channel.bind("new-message", (data: { message: Message }) => {
        // Only add the message if it's not from the current user (to avoid duplicates)
        if (data.message && data.message.senderId !== user?.id) {
          setMessages((prev) => [...prev, data.message]);
        }
      });
      
      return () => {
        pusher.unsubscribe(`chat-room-${roomId}`);
      };
    } catch (err) {
      console.error("Pusher error:", err);
    }
  }, [roomId, user?.id]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  function handleSendMessage() {
    if (!message.trim() || isSubmitting) return;
    
    sendMessageMutation.mutate({
      content: message,
      roomId,
    });
  }
  
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }
  
  function isCurrentUser(senderId: string) {
    return user?.id === senderId;
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading messages</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id || msg._id}
                className={`flex ${
                  isCurrentUser(msg.senderId) ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    isCurrentUser(msg.senderId)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium">
                      {isCurrentUser(msg.senderId) ? "You" : "User"}
                    </span>
                    <span className="text-xs opacity-70">
                      {(() => {
                        try {
                          // Handle different date formats
                          const date = msg.createdAt instanceof Date 
                            ? msg.createdAt 
                            : new Date(msg.createdAt);
                          
                          // Check if date is valid before formatting
                          if (!isNaN(date.getTime())) {
                            return formatDistanceToNow(date, {
                              addSuffix: true,
                            });
                          }
                          return "just now";
                        } catch (error) {
                          console.error("Error formatting date:", error);
                          return "just now";
                        }
                      })()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            disabled={isSubmitting}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isSubmitting || !message.trim()}
            className="shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 