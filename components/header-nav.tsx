"use client";

import { Award, Bell, Settings, User } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

interface HeaderNavProps {
  earnedCount: number;
  totalCount: number;
  onToggleAllNotifications: () => void;
}

export function HeaderNav({ earnedCount, totalCount, onToggleAllNotifications }: HeaderNavProps) {
  const { allNotificationsEnabled, permission } = useNotifications();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="mx-auto max-w-lg px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
              <Award className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground leading-tight">Badges</h1>
              <p className="text-[10px] text-muted-foreground">
                {earnedCount}/{totalCount} earned
              </p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleAllNotifications}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                "hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                allNotificationsEnabled && permission === "granted" && "text-accent"
              )}
              aria-label="Toggle all notifications"
            >
              <Bell className="h-4 w-4" />
              {allNotificationsEnabled && permission === "granted" && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
              )}
            </button>
            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Profile"
            >
              <User className="h-4 w-4" />
            </Link>
            <Link
              href="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
