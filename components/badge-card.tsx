"use client";

import type { Badge } from "@/lib/badges";
import { cn } from "@/lib/utils";
import {
  Rocket,
  Code,
  Users,
  Moon,
  Bug,
  Zap,
  Flame,
  Footprints,
  Languages,
  GraduationCap,
  Trophy,
  Handshake,
  Lock,
  ChevronRight,
  Bell,
  BellOff,
} from "lucide-react";
import type React from "react";

const iconMap: Record<string, React.ElementType> = {
  rocket: Rocket,
  code: Code,
  users: Users,
  moon: Moon,
  bug: Bug,
  zap: Zap,
  flame: Flame,
  footprints: Footprints,
  languages: Languages,
  "graduation-cap": GraduationCap,
  trophy: Trophy,
  handshake: Handshake,
};

// Clean solid colors for icons
const colorMap: Record<string, string> = {
  "from-amber-400 to-orange-500": "bg-amber-500",
  "from-cyan-400 to-blue-500": "bg-blue-500",
  "from-emerald-400 to-teal-500": "bg-emerald-500",
  "from-indigo-400 to-purple-500": "bg-indigo-500",
  "from-red-400 to-rose-500": "bg-rose-500",
  "from-yellow-400 to-amber-500": "bg-yellow-500",
  "from-orange-400 to-red-500": "bg-orange-500",
  "from-slate-400 to-zinc-500": "bg-slate-500",
  "from-violet-400 to-fuchsia-500": "bg-fuchsia-500",
  "from-teal-400 to-cyan-500": "bg-cyan-500",
  "from-amber-300 to-yellow-500": "bg-amber-400",
  "from-blue-400 to-indigo-500": "bg-blue-500",
};

interface BadgeCardProps {
  badge: Badge;
  onClick: () => void;
  index: number;
  notificationEnabled?: boolean;
  onToggleNotification?: (badgeId: string) => void;
}

export function BadgeCard({ badge, onClick, index, notificationEnabled, onToggleNotification }: BadgeCardProps) {
  const Icon = iconMap[badge.icon] || Rocket;
  const isEarned = !!badge.earnedAt;
  const bgColor = colorMap[badge.color] || "bg-blue-500";

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleNotification?.(badge.id);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl p-4 transition-all duration-200",
        "bg-card hover:bg-secondary",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        !isEarned && "opacity-60"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110",
          bgColor
        )}
      >
        {isEarned ? (
          <Icon className="h-6 w-6 text-white" />
        ) : (
          <Lock className="h-5 w-5 text-white/80" />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col items-start text-left">
        <span className="text-sm font-medium text-foreground truncate w-full">
          {badge.name}
        </span>
        <span className="text-xs text-muted-foreground truncate w-full">
          {badge.description}
        </span>
      </div>

      {/* Progress or Status */}
      <div className="flex shrink-0 items-center gap-2">
        {!isEarned && badge.progress !== undefined ? (
          <span className="text-xs font-medium text-muted-foreground">
            {badge.progress}%
          </span>
        ) : isEarned ? (
          <span className="text-xs text-emerald-500">Earned</span>
        ) : null}
        
        {/* Notification Bell */}
        {onToggleNotification && (
          <button
            type="button"
            onClick={handleNotificationClick}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              "hover:bg-secondary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              notificationEnabled ? "text-accent" : "text-muted-foreground"
            )}
            aria-label={notificationEnabled ? "Disable notifications" : "Enable notifications"}
          >
            {notificationEnabled ? (
              <Bell className="h-3.5 w-3.5" />
            ) : (
              <BellOff className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </button>
  );
}
