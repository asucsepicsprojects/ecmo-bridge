import { ChatLayout } from "~/components/chat/chat-layout";

export default function ChatPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Chat</h1>
        <p className="text-muted-foreground">
          Communicate with other healthcare professionals in real-time.
        </p>
      </div>
      
      <ChatLayout />
    </div>
  );
} 