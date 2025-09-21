"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { UserSearch } from "./user-search";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { X } from "lucide-react";

interface NewChatFormProps {
  onSuccess: () => void;
}

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "Conversation name is required"),
  participants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().optional(),
  })).min(1, "Add at least one participant"),
});

type FormValues = z.infer<typeof formSchema>;

export function NewChatForm({ onSuccess }: NewChatFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      participants: [],
    },
  });

  const createRoomMutation = api.chat.createRoom.useMutation({
    onSuccess: (data) => {
      const roomId = data.id || data._id;
      router.push(`/chat/${roomId}`);
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      console.error("Failed to create chat room:", error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    createRoomMutation.mutate({
      name: values.name,
      participantIds: values.participants.map((p) => p.id),
    });
  };

  const participants = form.watch("participants");

  const addParticipant = (user: { id: string; name: string; image?: string }) => {
    console.log("addParticipant called with:", user);
    const currentParticipants = form.getValues("participants");
    // Check if user already exists in participants
    if (!currentParticipants.some((p) => p.id === user.id)) {
      form.setValue("participants", [...currentParticipants, user]);
      console.log("Participant added:", [...currentParticipants, user]);
    } else {
      console.log("User already exists in participants");
    }
  };

  const removeParticipant = (id: string) => {
    const currentParticipants = form.getValues("participants");
    form.setValue(
      "participants",
      currentParticipants.filter((p) => p.id !== id)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conversation Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="E.g., ECMO Team, Cardiology Consult, etc."
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participants"
          render={() => (
            <FormItem>
              <FormLabel>Participants</FormLabel>
              <UserSearch
                onUserSelect={addParticipant}
                disabled={isSubmitting}
              />
              <div className="mt-2">
                {participants.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {participants.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs"
                      >
                        <Avatar className="h-4 w-4">
                          {user.image && (
                            <AvatarImage src={user.image} alt={user.name} />
                          )}
                          <AvatarFallback className="text-[8px]">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full"
                          onClick={() => removeParticipant(user.id)}
                          disabled={isSubmitting}
                        >
                          <X className="h-2 w-2" />
                          <span className="sr-only">Remove {user.name}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No participants added yet
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Conversation"}
          </Button>
        </div>
        
        {createRoomMutation.error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {createRoomMutation.error.message || "Failed to create conversation. Please try again."}
          </div>
        )}
      </form>
    </Form>
  );
} 