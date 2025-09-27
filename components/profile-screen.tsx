"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Share, Trophy, Zap, Heart, Play, Star } from "lucide-react"
import { videoStore, type RecordedVideo } from "@/lib/video-store"

const userStats = {
  name: "Alex Johnson",
  username: "@alexj",
  avatar: "/placeholder.svg?height=100&width=100",
  level: 32,
  points: 8420,
  streak: 12,
  followers: 1247,
  following: 892,
  daresCompleted: 156,
  daresCreated: 89,
  totalLikes: 12450,
}

const badges = [
  { id: 1, name: "First Dare", icon: "🎯", description: "Completed your first dare", earned: true },
  { id: 2, name: "Streak Master", icon: "🔥", description: "10 day streak", earned: true },
  { id: 3, name: "Popular Creator", icon: "⭐", description: "1000+ likes on a dare", earned: true },
  { id: 4, name: "Social Butterfly", icon: "💫", description: "100+ followers", earned: true },
  { id: 5, name: "Dare Devil", icon: "👑", description: "100+ dares completed", earned: true },
  { id: 6, name: "Creative Genius", icon: "🎨", description: "50+ original dares", earned: true },
  { id: 7, name: "Legend", icon: "🏆", description: "Top 100 global ranking", earned: false },
  { id: 8, name: "Viral Star", icon: "🌟", description: "10,000+ likes on a dare", earned: false },
]

const mockDares = [
  {
    id: "mock1",
    thumbnail: "/placeholder.svg?height=120&width=120",
    title: "Epic dance battle in the park",
    likes: 234,
    views: 1200,
    date: "2 days ago",
  },
  {
    id: "mock2",
    thumbnail: "/placeholder.svg?height=120&width=120",
    title: "Singing opera in a coffee shop",
    likes: 189,
    views: 890,
    date: "5 days ago",
  },
]

export function ProfileScreen() {
  const [selectedTab, setSelectedTab] = useState<"dares" | "badges">("dares")
  const [userVideos, setUserVideos] = useState<RecordedVideo[]>([])

  useEffect(() => {
    const unsubscribe = videoStore.subscribe(() => {
      setUserVideos(videoStore.getUserVideos("you"))
    })
    setUserVideos(videoStore.getUserVideos("you"))
    return unsubscribe
  }, [])

  return (
    <div className="h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-primary p-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-bold">Profile</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
              <Share className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
            <AvatarImage src={userStats.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-white text-primary text-2xl font-bold">
              {userStats.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-white text-xl font-bold">{userStats.name}</h2>
            <p className="text-white/80 text-sm mb-2">{userStats.username}</p>
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Lv.{userStats.level}
              </span>
              <span className="flex items-center gap-1">🔥 {userStats.streak} streak</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-white text-2xl font-bold">{userStats.points.toLocaleString()}</p>
            <p className="text-white/80 text-xs">Points</p>
          </div>
          <div className="text-center">
            <p className="text-white text-2xl font-bold">{userStats.followers.toLocaleString()}</p>
            <p className="text-white/80 text-xs">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-white text-2xl font-bold">{userStats.following}</p>
            <p className="text-white/80 text-xs">Following</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full">
            Edit Profile
          </Button>
          <Button className="flex-1 bg-gradient-energy hover:bg-gradient-energy/90 text-white rounded-full">
            Share Profile
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Achievement Summary */}
        <Card className="mb-6 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-success" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{userStats.daresCompleted}</p>
                <p className="text-sm text-muted-foreground">Dares Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{userStats.daresCreated}</p>
                <p className="text-sm text-muted-foreground">Dares Created</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Likes Received</span>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{userStats.totalLikes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={selectedTab === "dares" ? "default" : "outline"}
            onClick={() => setSelectedTab("dares")}
            className={`flex-1 rounded-full ${selectedTab === "dares" ? "bg-gradient-primary text-white" : ""}`}
          >
            <Play className="w-4 h-4 mr-2" />
            My Dares
          </Button>
          <Button
            variant={selectedTab === "badges" ? "default" : "outline"}
            onClick={() => setSelectedTab("badges")}
            className={`flex-1 rounded-full ${selectedTab === "badges" ? "bg-gradient-primary text-white" : ""}`}
          >
            <Star className="w-4 h-4 mr-2" />
            Badges
          </Button>
        </div>

        {/* Content */}
        {selectedTab === "dares" ? (
          <div className="grid grid-cols-2 gap-3">
            {userVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <video
                    src={video.video_url}
                    className="w-full h-32 object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </div>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{video.dare_text}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {video.likes_count}
                      </span>
                      <span>0 views</span>
                    </div>
                    <span>Just now</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {mockDares.map((dare) => (
              <Card key={dare.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={dare.thumbnail || "/placeholder.svg"}
                    alt={dare.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{dare.title}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {dare.likes}
                      </span>
                      <span>{dare.views} views</span>
                    </div>
                    <span>{dare.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={`transition-all ${
                  badge.earned
                    ? "bg-gradient-to-br from-success/10 to-primary/10 border-success/20"
                    : "opacity-50 bg-muted/50"
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {badge.earned && (
                    <div className="mt-2">
                      <span className="bg-gradient-success text-white text-xs px-2 py-1 rounded-full">Earned</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
