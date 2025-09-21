"use client";

import { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { ChevronsUpDown, Loader2, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useDebounce } from "~/hooks/use-debounce";

interface UserSearchProps {
  onUserSelect: (user: { id: string; name: string; image?: string }) => void;
  disabled?: boolean;
}

export function UserSearch({ onUserSelect, disabled = false }: UserSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { userId: currentUserId } = useAuth();

  // Memoize the query parameter to prevent unnecessary re-renders
  const queryParam = useMemo(() => ({ query: debouncedQuery }), [debouncedQuery]);

  // Single query that handles both search and all users
  const { data: users = [], isLoading } = api.user.search.useQuery(
    queryParam,
    { 
      enabled: open, // Only fetch when popover is open
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      refetchOnMount: false, // Prevent refetch on mount if data exists
    }
  );

  const displayUsers = users;
  const isSearching = isLoading;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Reset search query when popover closes
    if (!newOpen) {
      setSearchQuery("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="truncate">Search for users...</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search users..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {displayUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() => {
                        onUserSelect({
                          id: user.id,
                          name: user.name,
                          image: user.image,
                        });
                        setSearchQuery("");
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                          {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-6 w-6 rounded-full"
                            />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 