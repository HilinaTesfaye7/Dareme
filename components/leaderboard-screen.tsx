"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Crown, Zap, Globe, MapPin, Star } from "lucide-react"

const globalLeaders = [
  {
    rank: 1,
    name: "Emma Wilson",
    username: "@emmaw",
    avatar: "/girl-winner-avatar.jpg",
    points: 15420,
    badges: ["🔥", "👑", "⭐"],
    level: 47,
    streak: 23,
  },
  {
    rank: 2,
    name: "Marcus Chen",
    username: "@marcusc",
    avatar: "/boy-second-avatar.jpg",
    points: 14890,
    badges: ["🎯", "💎", "🚀"],
    level: 45,
    streak: 18,
  },
  {
    rank: 3,
    name: "Sofia Rodriguez",
    username: "@sofiar",
    avatar: "/girl-third-avatar.jpg",
    points: 13750,
    badges: ["🌟", "🎨", "💫"],
    level: 42,
    streak: 31,
  },
  {
    rank: 4,
    name: "Alex Kim",
    username: "@alexk",
    avatar: "/person-fourth-avatar.jpg",
    points: 12980,
    badges: ["⚡", "🎪", "🎭"],
    level: 40,
    streak: 15,
  },
  {
    rank: 5,
    name: "Jordan Taylor",
    username: "@jordant",
    avatar: "/person-fifth-avatar.jpg",
    points: 11650,
    badges: ["🎵", "🌈", "✨"],
    level: 38,
    streak: 27,
  },
]

const localLeaders = [
  {
    rank: 1,
    name: "You",
    username: "@yourname",
    avatar: "/ai-avatar.png",
    points: 8420,
    badges: ["🎯", "⭐", "🔥"],
    level: 32,
    streak: 12,
  },
  {
    rank: 2,
    name: "Sarah Johnson",
    username: "@sarahj",
    avatar: "/placeholder.svg?height=50&width=50",
    points: 7890,
    badges: ["💎", "🌟"],
    level: 29,
    streak: 8,
  },
  {
    rank: 3,
    name: "Mike Davis",
    username: "@miked",
    avatar: "/placeholder-gt8jw.png",
    points: 6750,
    badges: ["🚀", "⚡"],
    level: 26,
    streak: 15,
  },
]

export function LeaderboardScreen() {
  const [selectedTab, setSelectedTab] = useState<"global" | "local">("global")

  const leaders = selectedTab === "global" ? globalLeaders : localLeaders

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">
            #{rank}
          </span>
        )
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600"
      default:
        return "bg-gradient-primary"
    }
  }

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-4 pt-12">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">🏆 Leaderboard</h1>

        {/* Tab Selection */}
        <div className="flex gap-2">
          <Button
            variant={selectedTab === "global" ? "secondary" : "ghost"}
            onClick={() => setSelectedTab("global")}
            className={`flex-1 ${selectedTab === "global" ? "bg-white text-primary" : "text-white hover:bg-white/20"}`}
          >
            <Globe className="w-4 h-4 mr-2" />
            Global
          </Button>
          <Button
            variant={selectedTab === "local" ? "secondary" : "ghost"}
            onClick={() => setSelectedTab("local")}
            className={`flex-1 ${selectedTab === "local" ? "bg-white text-primary" : "text-white hover:bg-white/20"}`}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Local
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-6">
          {leaders.slice(0, 3).map((leader, index) => {
            const positions = [1, 0, 2] // Second, First, Third
            const actualLeader = leaders[positions[index]]
            const heights = ["h-20", "h-24", "h-16"]

            return (
              <div key={actualLeader.rank} className="flex flex-col items-center">
                <Avatar className="w-16 h-16 mb-2 border-4 border-white shadow-lg">
                  <AvatarImage src={actualLeader.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {actualLeader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`${getRankBg(actualLeader.rank)} ${heights[index]} w-16 rounded-t-lg flex items-center justify-center`}
                >
                  {getRankIcon(actualLeader.rank)}
                </div>
                <p className="text-xs font-semibold mt-2 text-center">{actualLeader.name}</p>
                <p className="text-xs text-muted-foreground">{actualLeader.points.toLocaleString()}</p>
              </div>
            )
          })}
        </div>

        {/* Full Leaderboard */}
        <div className="space-y-3">
          {leaders.map((leader) => (
            <Card
              key={leader.rank}
              className={`transition-all hover:shadow-md ${
                leader.name === "You" ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8">{getRankIcon(leader.rank)}</div>

                  <Avatar className="w-12 h-12">
                    <AvatarImage src={leader.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {leader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{leader.name}</h3>
                      {leader.name === "You" && (
                        <span className="bg-gradient-primary text-white text-xs px-2 py-1 rounded-full">You</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{leader.username}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {leader.badges.map((badge, index) => (
                        <span key={index} className="text-sm">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-energy" />
                      <span className="font-bold text-lg">{leader.points.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Lv.{leader.level}</span>
                      <span>🔥{leader.streak}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Your Stats Card */}
        {selectedTab === "global" && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Your Global Rank
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">#247</p>
                  <p className="text-sm text-muted-foreground">Out of 50,000+ users</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">8,420 points</p>
                  <p className="text-sm text-muted-foreground">Level 32 • 🔥12 streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
