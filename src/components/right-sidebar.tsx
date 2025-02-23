'use client';

import { Input } from "@/components/ui/input";
import { UserSuggestion } from "@/components/user-suggestion";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/utils/api";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function RightSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: searchResults, isLoading: isSearching } = api.user.search.useQuery(
    { query: debouncedQuery, limit: 5 },
    { enabled: debouncedQuery.length > 0 }
  );

  const { data: suggestions, isLoading: isSuggestionsLoading } =
    api.user.getRandomSuggestions.useQuery({ limit: 3 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="sticky top-0 hidden w-[350px] pl-8 xl:block">
      <div className="space-y-6 pt-5">
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
          />

          {isSearchOpen && debouncedQuery.length > 0 && (
            <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-background shadow-lg">
              {isSearching ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : searchResults?.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              ) : (
                <div className="py-2">
                  {searchResults?.map((user) => (
                    <Link
                      key={user.id}
                      href={`/users/${user.id}`}
                      className="block px-4 py-2 hover:bg-muted"
                    >
                      <p className="font-medium">{user.name || `@${user.username}`}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-muted/50 p-4">
          <h2 className="mb-4 text-xl font-bold">Who to follow</h2>
          <div className="space-y-4">
            {isSuggestionsLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : suggestions?.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                No suggestions available
              </div>
            ) : (
              suggestions?.map((user) => (
                <UserSuggestion key={user.id} user={user} />
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
} 