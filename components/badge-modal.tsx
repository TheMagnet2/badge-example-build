"use client";

import type React from "react";
import type { Badge } from "@/lib/badges";
import { rarityConfig } from "@/lib/badges";
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
  X,
  Calendar,
  Tag,
  Lock,
} from "lucide-react";
import { useEffect, useRef } from "react";

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

interface BadgeModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export function BadgeModal({ badge, onClose }: BadgeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (badge) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [badge, onClose]);

  if (!badge) return null;

  const Icon = iconMap[badge.icon] || Rocket;
  const rarity = rarityConfig[badge.rarity];
  const isEarned = !!badge.earnedAt;
  const bgColor = colorMap[badge.color] || "bg-blue-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-title"
    >
      {/* Modal container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 fade-in duration-300"
      >
        {/* Modal content */}
        <div className="relative overflow-hidden rounded-t-3xl sm:rounded-3xl bg-card">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="p-6 pt-16 flex flex-col items-center">
            {/* Badge icon */}
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full mb-4 transition-transform hover:scale-105",
                bgColor,
                !isEarned && "opacity-60"
              )}
            >
              {isEarned ? (
                <Icon className="h-10 w-10 text-white" />
              ) : (
                <Lock className="h-8 w-8 text-white/80" />
              )}
            </div>

            {/* Badge name */}
            <h2
              id="badge-title"
              className="mb-1 text-center text-xl font-semibold text-foreground"
            >
              {badge.name}
            </h2>

            {/* Short description */}
            <p className="mb-4 text-center text-sm text-muted-foreground">
              {badge.description}
            </p>

            {/* Rarity tag */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mb-6",
                rarity.color,
                "text-white"
              )}
            >
              {rarity.label}
            </span>

            {/* Detailed description */}
            <div className="w-full mb-6 rounded-2xl bg-secondary p-4">
              <p className="text-sm leading-relaxed text-foreground/80">
                {badge.longDescription}
              </p>
            </div>

            {/* Progress for unearned badges */}
            {!isEarned && badge.progress !== undefined && (
              <div className="w-full mb-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{badge.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      bgColor
                    )}
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Meta info */}
            <div className="w-full flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">{badge.category}</span>
              </div>
              {isEarned && (
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground">
                    {new Date(badge.earnedAt!).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Status indicator */}
            <div
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium",
                isEarned
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  isEarned ? "bg-emerald-500" : "bg-amber-500"
                )}
              />
              {isEarned ? "Badge Earned" : "In Progress"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
