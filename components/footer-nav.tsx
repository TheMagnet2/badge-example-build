"use client";

import { Award, Trophy, Star, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Award, label: "Badges" },
  { href: "/achievements", icon: Trophy, label: "Achievements" },
  { href: "/leaderboard", icon: Star, label: "Leaderboard" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 pb-safe">
      <nav className="mx-auto max-w-lg">
        <ul className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
                    isActive
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
