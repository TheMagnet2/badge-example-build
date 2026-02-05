"use client"

import { useState, useMemo, useRef } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimelineEvent {
  id: string
  name: string
  startDate: Date
  endDate: Date
  color?: string
  description?: string
  avatar?: string
  initials?: string
}

interface TimelineBarProps {
  events: TimelineEvent[]
  startDate?: Date
  endDate?: Date
  className?: string
}

const defaultColors = [
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
]

const defaultAvatarColors = [
  "bg-cyan-500/20 text-cyan-400",
  "bg-amber-500/20 text-amber-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-violet-500/20 text-violet-400",
  "bg-rose-500/20 text-rose-400",
]

export function TimelineBar({
  events,
  startDate: propStartDate,
  endDate: propEndDate,
  className,
}: TimelineBarProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { timelineStart, totalDays, days } = useMemo(() => {
    const allDates = events.flatMap((e) => [e.startDate, e.endDate])
    const minDate = propStartDate || new Date(Math.min(...allDates.map((d) => d.getTime())))
    const maxDate = propEndDate || new Date(Math.max(...allDates.map((d) => d.getTime())))

    const start = new Date(minDate)
    start.setDate(start.getDate() - 2)
    const end = new Date(maxDate)
    end.setDate(end.getDate() + 2)

    const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    const daysList: { date: Date; dayNum: number; month: string; dayName: string; isWeekend: boolean; isFirstOfMonth: boolean }[] = []
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      const dayOfWeek = date.getDay()
      daysList.push({
        date,
        dayNum: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isFirstOfMonth: date.getDate() === 1,
      })
    }

    return {
      timelineStart: start,
      totalDays: dayCount,
      days: daysList,
    }
  }, [events, propStartDate, propEndDate])

  const calculatePosition = (date: Date) => {
    const daysDiff = Math.ceil((date.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const DAY_WIDTH = 40
  const DAY_WIDTH_MOBILE = 32

  const activeEvent = selectedEvent || hoveredEvent

  return (
    <div className={cn("w-full", className)}>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {events.length} events
        </div>
      </div>

      {/* Mobile: Selected event details card */}
      {activeEvent && (
        <div className="md:hidden mb-4 p-4 bg-secondary/50 rounded-xl border border-border">
          {events.filter(e => e.id === activeEvent).map((event, index) => {
            const colorClass = event.color || defaultColors[events.indexOf(event) % defaultColors.length]
            const avatarColor = defaultAvatarColors[events.indexOf(event) % defaultAvatarColors.length]
            const duration = Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24))
            return (
              <div key={event.id} className="flex items-start gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-background">
                  {event.avatar ? (
                    <AvatarImage src={event.avatar || "/placeholder.svg"} alt={event.name} />
                  ) : null}
                  <AvatarFallback className={cn("text-sm font-semibold", avatarColor)}>
                    {event.initials || event.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{event.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {event.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-2">{event.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn("h-2 w-8 rounded-full bg-gradient-to-r", colorClass)} />
                    <span className="text-xs font-mono text-muted-foreground">{duration} days</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex">
        {/* Event labels column - hidden on mobile */}
        <div className="hidden md:block flex-shrink-0 w-48 pr-4 border-r border-border">
          {/* Header spacer */}
          <div className="h-14 flex items-end pb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Events
            </span>
          </div>

          {/* Event rows */}
          <div className="space-y-2">
            {events.map((event, index) => {
              const avatarColor = defaultAvatarColors[index % defaultAvatarColors.length]
              return (
                <div
                  key={event.id}
                  className={cn(
                    "h-12 flex items-center gap-3 rounded-lg px-2 transition-colors cursor-pointer",
                    activeEvent === event.id && "bg-secondary"
                  )}
                  onMouseEnter={() => setHoveredEvent(event.id)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  <Avatar className="h-8 w-8 ring-2 ring-background">
                    {event.avatar ? (
                      <AvatarImage src={event.avatar || "/placeholder.svg"} alt={event.name} />
                    ) : null}
                    <AvatarFallback className={cn("text-xs font-semibold", avatarColor)}>
                      {event.initials || event.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {event.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24))}d
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Timeline area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent touch-pan-x"
        >
          <div 
            className="min-w-full"
            style={{ width: `max(100%, ${totalDays * DAY_WIDTH}px)` }}
          >
            {/* Day headers */}
            <div className="h-14 flex border-b border-border sticky top-0 bg-card z-10">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-shrink-0 flex flex-col items-center justify-end pb-2",
                    day.isWeekend && "bg-secondary/30",
                    day.isFirstOfMonth && "border-l-2 border-primary/50"
                  )}
                  style={{ width: `clamp(${DAY_WIDTH_MOBILE}px, 5vw, ${DAY_WIDTH}px)` }}
                >
                  {day.isFirstOfMonth && (
                    <span className="text-[10px] font-semibold text-primary mb-0.5">
                      {day.month}
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-[10px] md:text-xs font-mono",
                      day.isWeekend ? "text-muted-foreground/50" : "text-muted-foreground"
                    )}
                  >
                    {day.dayNum}
                  </span>
                </div>
              ))}
            </div>

            {/* Event bars */}
            <div className="space-y-2">
              {events.map((event, index) => {
                const startDay = calculatePosition(event.startDate)
                const endDay = calculatePosition(event.endDate)
                const duration = endDay - startDay
                const colorClass = event.color || defaultColors[index % defaultColors.length]
                const isActive = activeEvent === event.id

                return (
                  <div
                    key={event.id}
                    className="relative h-12 flex items-center"
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                  >
                    {/* Background grid */}
                    <div className="absolute inset-0 flex">
                      {days.map((day, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex-shrink-0 border-r border-border/30",
                            day.isWeekend && "bg-secondary/30",
                            day.isFirstOfMonth && "border-l-2 border-primary/50"
                          )}
                          style={{ width: `clamp(${DAY_WIDTH_MOBILE}px, 5vw, ${DAY_WIDTH}px)` }}
                        />
                      ))}
                    </div>

                    {/* Event bar */}
                    <div
                      className={cn(
                        "absolute h-9 rounded-full bg-gradient-to-r shadow-lg transition-all duration-200 cursor-pointer flex items-center",
                        colorClass,
                        isActive ? "scale-y-110 shadow-xl ring-2 ring-white/20" : ""
                      )}
                      style={{
                        left: `calc(${startDay} * clamp(${DAY_WIDTH_MOBILE}px, 5vw, ${DAY_WIDTH}px) + 4px)`,
                        width: `calc(${Math.max(duration, 1)} * clamp(${DAY_WIDTH_MOBILE}px, 5vw, ${DAY_WIDTH}px) - 8px)`,
                        minWidth: '28px',
                      }}
                    >
                      {/* Avatar at start */}
                      <div className="flex-shrink-0 ml-0.5 md:ml-1">
                        <Avatar className="h-6 w-6 md:h-7 md:w-7 ring-2 ring-white/30">
                          {event.avatar ? (
                            <AvatarImage src={event.avatar || "/placeholder.svg"} alt={event.name} />
                          ) : null}
                          <AvatarFallback className="bg-white/20 text-white text-[8px] md:text-[10px] font-bold">
                            {event.initials || event.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Event name - hide on mobile for short bars */}
                      <span className={cn(
                        "ml-1 md:ml-2 text-[10px] md:text-xs font-semibold text-white truncate pr-2 md:pr-3",
                        duration <= 3 && "hidden md:inline"
                      )}>
                        {event.name}
                      </span>

                      {/* Progress indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/40"
                          style={{ width: "45%" }}
                        />
                      </div>
                    </div>

                    {/* Tooltip - desktop only */}
                    {isActive && (
                      <div
                        className="hidden md:block absolute z-20 bottom-full mb-2 px-4 py-3 bg-popover text-popover-foreground rounded-xl shadow-2xl border border-border min-w-[200px]"
                        style={{
                          left: `calc(${startDay} * clamp(${DAY_WIDTH_MOBILE}px, 5vw, ${DAY_WIDTH}px) + ${duration * DAY_WIDTH / 2}px)`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        <p className="font-semibold text-sm mb-1">{event.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {event.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {event.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</span>
                          <span className="text-xs font-mono font-semibold text-foreground">{duration} days</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
