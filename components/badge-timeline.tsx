"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Radio, ChevronDown, ChevronUp } from "lucide-react";

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
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  // Get 14 days starting from today
  const getDays = () => {
    const days: Date[] = [];
    for (let i = 0; i < 14; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const days = getDays();

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, today);
  };

  const getReleasesForDate = (date: Date) => {
    return badgeReleases.filter((release) => isSameDay(release.date, date));
  };

  // Calculate progress through the 14-day period
  const getProgress = () => {
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const now = new Date();
    const hoursElapsed = (now.getTime() - startOfDay.getTime()) / (1000 * 60 * 60);
    return Math.min((hoursElapsed / 24) * (100 / 14), 100 / 14);
  };

  const handleDayClick = (day: Date) => {
    const releases = getReleasesForDate(day);
    const hasReleases = releases.length > 0;
    
    if (hasReleases) {
      setSelectedDate(isSameDay(day, selectedDate || new Date(0)) ? null : day);
      
      const liveRelease = releases.find((r) => r.isLive && r.livestreamUrl);
      if (liveRelease && onOpenLivestream) {
        onOpenLivestream(liveRelease.livestreamUrl!);
      }
    }
  };

  const selectedReleases = selectedDate ? getReleasesForDate(selectedDate) : [];

  // Find upcoming releases
  const upcomingReleases = badgeReleases
    .filter((r) => r.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  const liveNow = badgeReleases.find((r) => r.isLive && isSameDay(r.date, today));

  return (
    <div className="bg-card/50 rounded-xl overflow-hidden">
      {/* Compact Header Bar */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          {liveNow ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500 uppercase tracking-wide">
              <Radio className="h-2.5 w-2.5 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Releases
            </span>
          )}
          {upcomingReleases.length > 0 && (
            <span className="text-xs text-foreground font-medium truncate max-w-[140px]">
              {liveNow ? liveNow.name : upcomingReleases[0].name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {upcomingReleases.length} upcoming
          </span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Progress Bar Timeline */}
      <div className="px-3 pb-2">
        <div className="relative">
          {/* Background track */}
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            {/* Progress fill - animated */}
            <div 
              className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all duration-1000"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          
          {/* Day markers */}
          <div 
            ref={scrollRef}
            className="flex justify-between mt-1 overflow-x-auto scrollbar-none -mx-1 px-1"
          >
            {days.map((day, index) => {
              const releases = getReleasesForDate(day);
              const hasRelease = releases.length > 0;
              const hasLive = releases.some((r) => r.isLive);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const dayProgress = (index / 14) * 100;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={!hasRelease}
                  className={cn(
                    "flex flex-col items-center min-w-[28px] py-1 transition-all",
                    hasRelease && "cursor-pointer hover:opacity-80",
                    !hasRelease && "opacity-40 cursor-default"
                  )}
                >
                  {/* Marker dot on the timeline */}
                  <div className={cn(
                    "w-2 h-2 rounded-full -mt-2.5 mb-1 transition-all",
                    hasLive && "bg-red-500 animate-pulse ring-2 ring-red-500/30",
                    hasRelease && !hasLive && "bg-accent ring-2 ring-accent/30",
                    !hasRelease && isToday(day) && "bg-foreground/50",
                    !hasRelease && !isToday(day) && "bg-transparent",
                    isSelected && "scale-125"
                  )} />
                  
                  {/* Day number */}
                  <span className={cn(
                    "text-[9px] font-medium",
                    isToday(day) ? "text-accent" : "text-muted-foreground",
                    isSelected && "text-foreground"
                  )}>
                    {day.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border/30">
          {/* Quick upcoming list */}
          <div className="flex flex-col gap-1.5 mt-2">
            {upcomingReleases.map((release) => (
              <button
                key={release.id}
                type="button"
                onClick={() => {
                  if (release.isLive && release.livestreamUrl && onOpenLivestream) {
                    onOpenLivestream(release.livestreamUrl);
                  }
                }}
                className={cn(
                  "flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors",
                  release.isLive ? "bg-red-500/10 hover:bg-red-500/20" : "bg-secondary/30 hover:bg-secondary/50"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {release.isLive && (
                    <Radio className="h-2.5 w-2.5 text-red-500 animate-pulse shrink-0" />
                  )}
                  <span className="text-xs font-medium text-foreground truncate">
                    {release.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-muted-foreground">
                    {release.category}
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium",
                    isSameDay(release.date, today) ? "text-accent" : "text-muted-foreground"
                  )}>
                    {isSameDay(release.date, today) 
                      ? "Today" 
                      : release.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Date Detail (shows inline when a marker is clicked) */}
      {selectedDate && selectedReleases.length > 0 && !expanded && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-secondary/30 rounded-lg">
            {selectedReleases[0].isLive && (
              <Radio className="h-2.5 w-2.5 text-red-500 animate-pulse shrink-0" />
            )}
            <span className="text-xs font-medium text-foreground truncate">
              {selectedReleases[0].name}
            </span>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {selectedReleases[0].category}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
