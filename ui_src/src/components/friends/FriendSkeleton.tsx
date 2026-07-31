import { memo } from "react";

export const FriendSkeleton = memo(function FriendSkeleton({ accentColor }: any) {
  return <div className="friend-skeleton animate-pulse bg-white/10 h-12 w-full rounded-md" />;
});
