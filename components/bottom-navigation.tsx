"use client"

import { Button } from "@/components/ui/button"
import { Home, Send, Video, Trophy, User } from "lucide-react"

interface BottomNavigationProps {
  activeScreen: "home" | "send" | "record" | "leaderboard" | "profile"
  onScreenChange: (screen: "home" | "send" | "record" | "leaderboard" | "profile") => void
}

export function BottomNavigation({ activeScreen, onScreenChange }: BottomNavigationProps) {
  const navItems = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "send" as const, icon: Send, label: "Send" },
    { id: "record" as const, icon: Video, label: "Record" },
    { id: "leaderboard" as const, icon: Trophy, label: "Ranks" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeScreen === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onScreenChange(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "animate-bounce-in" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
