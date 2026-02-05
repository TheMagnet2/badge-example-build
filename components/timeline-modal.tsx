"use client"

import { X, Calendar } from "lucide-react"
import { TimelineBar } from "./timeline-bar"
import { cn } from "@/lib/utils"

interface TimelineModalProps {
  isOpen: boolean
  onClose: () => void
}

// Sample badge release events - customize as needed
const badgeReleases = [
  {
    id: "1",
    name: "Early Bird Badge",
    startDate: new Date(2026, 1, 1),
    endDate: new Date(2026, 1, 7),
    description: "Available for the first week of February",
    initials: "EB",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "2",
    name: "Valentine Special",
    startDate: new Date(2026, 1, 10),
    endDate: new Date(2026, 1, 16),
    description: "Limited edition Valentine's Day badge",
    initials: "VS",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "3",
    name: "Winter Champion",
    startDate: new Date(2026, 1, 5),
    endDate: new Date(2026, 1, 20),
    description: "Complete winter challenges to earn",
    initials: "WC",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "4",
    name: "Community Hero",
    startDate: new Date(2026, 1, 15),
    endDate: new Date(2026, 1, 28),
    description: "Help 10 community members",
    initials: "CH",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "5",
    name: "Stream Legend",
    startDate: new Date(2026, 1, 8),
    endDate: new Date(2026, 1, 22),
    description: "Watch 50 hours of streams",
    initials: "SL",
    color: "from-violet-500 to-purple-600",
  },
]

export function TimelineModal({ isOpen, onClose }: TimelineModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full sm:max-w-3xl sm:mx-4 bg-card border border-border rounded-t-3xl sm:rounded-2xl",
        "max-h-[85vh] overflow-hidden flex flex-col",
        "animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
      )}>
        {/* Handle bar for mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Badge Releases</h2>
              <p className="text-xs text-muted-foreground">Upcoming badges and events</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-auto p-5">
          <TimelineBar 
            events={badgeReleases}
            startDate={new Date(2026, 1, 1)}
            endDate={new Date(2026, 2, 1)}
          />
        </div>
      </div>
    </div>
  )
}
