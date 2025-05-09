'use client';

import { UserAvatar } from "@/components/user-avatar";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface UserListProps {
  type: 'followers' | 'following';
  username: string;
}

export function UserList({ type, username }: UserListProps) {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = type === 'followers'
      ? api.user.getFollowers.useInfiniteQuery(
        { username, limit: 20 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
      : api.user.getFollowing.useInfiniteQuery(
        { username, limit: 20 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.pages[0]?.items.length) {
    return (
      <div className="flex justify-center p-4 text-muted-foreground">
        No {type === 'followers' ? 'followers' : 'following'} yet
      </div>
    );
  }

  return (
    <div>
      {data?.pages.map((page) =>
        page.items.map((user) => (
          <Link
            key={user.id}
            href={`/${user.username}`}
            className="flex items-center gap-3 border-b border-border p-4 hover:bg-muted/50"
          >
            <UserAvatar
              src={user.image}
              className="h-10 w-10"
              fallback={user.username[0]}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {`@${user.username}`}
              </p>
            </div>
          </Link>
        ))
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <div ref={ref} className="h-4" />
    </div>
  );
} 