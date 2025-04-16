"use client";

import { useState } from "react";
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

  // Fetch users with the search query
  const { data: users = [], isLoading } = api.user.search.useQuery(
    { query: debouncedQuery },
    { 
      enabled: debouncedQuery.trim().length > 0 && open,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  // Fetch all users if no search query
  const { data: allUsers = [], isLoading: isLoadingAll } = api.user.getAll.useQuery(
    undefined,
    { 
      enabled: debouncedQuery.trim().length === 0 && open,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  // Use search results when there's a query, otherwise use all users
  const displayUsers = debouncedQuery.trim().length > 0 ? users : allUsers;
  const isSearching = (debouncedQuery.trim().length > 0 && isLoading) || (debouncedQuery.trim().length === 0 && isLoadingAll);

  return (
    <Popover open={open} onOpenChange={setOpen}>
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