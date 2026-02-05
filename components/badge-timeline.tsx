"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar, Radio } from "lucide-react";

interface BadgeRelease {
  id: string;
  name: string;
  date: Date;
  category: string;
  isLive?: boolean;
  livestreamUrl?: string;
}

// Example badge releases - this would come from your data source
const badgeReleases: BadgeRelease[] = [
  { id: "r1", name: "Winter Champion", date: new Date(2026, 1, 5), category: "Seasonal" },
  { id: "r2", name: "Speed Runner", date: new Date(2026, 1, 6), category: "Gaming", isLive: true, livestreamUrl: "https://twitch.tv" },
  { id: "r3", name: "Loyal Supporter", date: new Date(2026, 1, 7), category: "Loyalty" },
  { id: "r4", name: "Challenge Master", date: new Date(2026, 1, 8), category: "Challenges" },
  { id: "r5", name: "Event Hero", date: new Date(2026, 1, 10), category: "Events" },
  { id: "r6", name: "Stream Legend", date: new Date(2026, 1, 12), category: "Streaming" },
  { id: "r7", name: "Limited Trophy", date: new Date(2026, 1, 14), category: "Limited Edition" },
];

interface BadgeTimelineProps {
  onOpenLivestream?: (url: string) => void;
}

export function BadgeTimeline({ onOpenLivestream }: BadgeTimelineProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate days for the current week view
  const getDaysInView = () => {
    const days: Date[] = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - 3); // Show 3 days before and after

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const days = getDaysInView();

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDayNumber = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getReleasesForDate = (date: Date) => {
    return badgeReleases.filter((release) => isSameDay(release.date, date));
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const releases = getReleasesForDate(date);
    const liveRelease = releases.find((r) => r.isLive && r.livestreamUrl);
    if (liveRelease && onOpenLivestream) {
      onOpenLivestream(liveRelease.livestreamUrl!);
    }
  };

  // Auto-scroll to today on mount
  useEffect(() => {
    if (scrollRef.current) {
      const todayIndex = days.findIndex((d) => isToday(d));
      if (todayIndex !== -1) {
        const scrollAmount = todayIndex * 60 - scrollRef.current.offsetWidth / 2 + 30;
        scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
      }
    }
  }, []);

  const selectedReleases = selectedDate ? getReleasesForDate(selectedDate) : [];

  return (
    <div className="bg-card rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Badge Releases</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigateWeek("prev")}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-secondary transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground min-w-[80px] text-center">
            {currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
          <button
            type="button"
            onClick={() => navigateWeek("next")}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-secondary transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Days Row */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        {days.map((day) => {
          const releases = getReleasesForDate(day);
          const hasRelease = releases.length > 0;
          const hasLive = releases.some((r) => r.isLive);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDateSelect(day)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[52px] h-[68px] rounded-xl transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isToday(day) && !isSelected && "bg-accent/20",
                isSelected && "bg-accent text-accent-foreground",
                !isSelected && !isToday(day) && "bg-secondary/50 hover:bg-secondary"
              )}
            >
              <span className={cn(
                "text-[10px] uppercase",
                isSelected ? "text-accent-foreground/80" : "text-muted-foreground"
              )}>
                {formatDayName(day)}
              </span>
              <span className={cn(
                "text-lg font-semibold",
                isSelected ? "text-accent-foreground" : "text-foreground"
              )}>
                {formatDayNumber(day)}
              </span>
              {/* Release indicator */}
              <div className="flex gap-0.5 mt-0.5 h-2">
                {hasLive ? (
                  <Radio className="h-2 w-2 text-red-500 animate-pulse" />
                ) : hasRelease ? (
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Date Releases */}
      {selectedDate && selectedReleases.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex flex-col gap-2">
            {selectedReleases.map((release) => (
              <div
                key={release.id}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg",
                  release.isLive ? "bg-red-500/10" : "bg-secondary/50"
                )}
              >
                <div className="flex items-center gap-2">
                  {release.isLive && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-red-500 uppercase">
                      <Radio className="h-2.5 w-2.5 animate-pulse" />
                      Live
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground">{release.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{release.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No releases message */}
      {selectedDate && selectedReleases.length === 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center py-2">
            No badge releases scheduled for this day
          </p>
        </div>
      )}
    </div>
  );
}
