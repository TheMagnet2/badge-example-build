"use client";

import { useState, useEffect } from "react";
import { badges, categories, type Badge } from "@/lib/badges";
import { BadgeCard } from "./badge-card";
import { BadgeModal } from "./badge-modal";
import { CategoryFilter } from "./category-filter";
import { HeaderNav } from "./header-nav";
import { FooterNav } from "./footer-nav";
import { BadgeTimeline } from "./badge-timeline";
import { useNotifications } from "@/hooks/use-notifications";
import { usePWA } from "@/hooks/use-pwa";
import { Search } from "lucide-react";

export function BadgeGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  const { 
    toggleBadgeNotification, 
    toggleAllNotifications, 
    isBadgeNotificationEnabled 
  } = useNotifications();
  
  // Initialize PWA
  usePWA();

  // Handle livestream opening
  const handleOpenLivestream = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
      {/* Header Navigation */}
      <HeaderNav 
        earnedCount={earnedCount} 
        totalCount={badges.length}
        onToggleAllNotifications={toggleAllNotifications}
      />
      
      {/* Sub-header with Search and Filters */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="mx-auto max-w-lg px-4 py-3">
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

          {/* Category filter */}
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          
          {/* Badge Timeline - Compact */}
          <div className="mt-3">
            <BadgeTimeline onOpenLivestream={handleOpenLivestream} />
          </div>
        </div>
      </div>

      {/* Badge list */}
      <main className="flex-1 mx-auto max-w-lg w-full px-4 pb-24 pt-3">
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
    </div>
  );
}
