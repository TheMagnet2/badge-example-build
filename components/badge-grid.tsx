"use client";

import { useState } from "react";
import { badges, categories, type Badge } from "@/lib/badges";
import { BadgeCard } from "./badge-card";
import { BadgeModal } from "./badge-modal";
import { CategoryFilter } from "./category-filter";
import { FooterNav } from "./footer-nav";
import { TimelineModal } from "./timeline-modal";
import { useNotifications } from "@/hooks/use-notifications";
import { usePWA } from "@/hooks/use-pwa";
import { Search, Calendar, Bell, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export function BadgeGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  
  const { 
    toggleBadgeNotification, 
    toggleAllNotifications,
    allNotificationsEnabled,
    permission,
    isBadgeNotificationEnabled 
  } = useNotifications();
  
  // Initialize PWA
  usePWA();

  const filteredBadges = badges.filter((badge) => {
    const matchesCategory =
      selectedCategory === "All" || badge.category === selectedCategory;
    const matchesSearch =
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const earnedCount = badges.filter((b) => b.earnedAt).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Compact Top Bar */}
      <div className="bg-background border-b border-border/30">
        <div className="mx-auto max-w-lg px-4 py-3">
          {/* Title row with actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                <Award className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-foreground leading-tight">Badges</h1>
                <p className="text-[10px] text-muted-foreground">
                  {earnedCount}/{badges.length} earned
                </p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {/* Timeline button */}
              <button
                type="button"
                onClick={() => setIsTimelineOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors"
                aria-label="View badge release timeline"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </button>
              
              {/* Notifications toggle */}
              <button
                type="button"
                onClick={toggleAllNotifications}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  "hover:bg-secondary",
                  allNotificationsEnabled && permission === "granted" && "text-accent"
                )}
                aria-label="Toggle all notifications"
              >
                <Bell className="h-4 w-4" />
                {allNotificationsEnabled && permission === "granted" && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search badges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-0 bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Category filter - horizontal scroll */}
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* Badge list - main focus area */}
      <main className="flex-1 mx-auto max-w-lg w-full px-4 pb-24 pt-4 overflow-y-auto">
        {filteredBadges.length > 0 ? (
          <div className="flex flex-col gap-2">
            {filteredBadges.map((badge, index) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                index={index}
                onClick={() => setSelectedBadge(badge)}
                notificationEnabled={isBadgeNotificationEnabled(badge.id)}
                onToggleNotification={toggleBadgeNotification}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-card">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-sm font-medium text-foreground">
              No badges found
            </h3>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <FooterNav />

      {/* Badge detail modal */}
      <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
      
      {/* Timeline modal */}
      <TimelineModal 
        isOpen={isTimelineOpen} 
        onClose={() => setIsTimelineOpen(false)} 
      />
    </div>
  );
}
