"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share, Plus, Play, Pause } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HomeFeedProps {
  onSendDare: () => void
  onRecord: () => void
}

const mockVideos = [
  {
    id: "1",
    video_url: "/teen-doing-dance-dare.jpg",
    dare_text: "Do the most epic dance move you know for 30 seconds!",
    likes_count: 1247,
    comments_count: 89,
    shares_count: 34,
    user: {
      username: "danceking23",
      display_name: "Alex Chen",
      avatar_url: "/teen-avatar.png",
    },
  },
  {
    id: "2",
    video_url: "/teen-doing-funny-challenge.jpg",
    dare_text: "Try to say the alphabet backwards while doing jumping jacks!",
    likes_count: 892,
    comments_count: 56,
    shares_count: 23,
    user: {
      username: "funnygirl",
      display_name: "Maya Rodriguez",
      avatar_url: "/teen-avatar.png",
    },
  },
  {
    id: "3",
    video_url: "/placeholder-085xr.png",
    dare_text: "Create a 10-second story using only objects around you!",
    likes_count: 2156,
    comments_count: 134,
    shares_count: 67,
    user: {
      username: "creativekid",
      display_name: "Jordan Smith",
      avatar_url: "/teen-avatar.png",
    },
  },
  {
    id: "4",
    video_url: "/teen-doing-dance-dare.jpg",
    dare_text: "Sing your favorite song in a funny voice for 15 seconds!",
    likes_count: 1834,
    comments_count: 92,
    shares_count: 45,
    user: {
      username: "singstar",
      display_name: "Emma Wilson",
      avatar_url: "/teen-avatar.png",
    },
  },
  {
    id: "5",
    video_url: "/teen-doing-funny-challenge.jpg",
    dare_text: "Do 10 push-ups while reciting your favorite movie quote!",
    likes_count: 967,
    comments_count: 78,
    shares_count: 29,
    user: {
      username: "fitnessfun",
      display_name: "Marcus Johnson",
      avatar_url: "/teen-avatar.png",
    },
  },
]

export function HomeFeed({ onSendDare, onRecord }: HomeFeedProps) {
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isUpSwipe = distance > minSwipeDistance
    const isDownSwipe = distance < -minSwipeDistance

    if (isUpSwipe && currentVideo < mockVideos.length - 1) {
      setCurrentVideo(currentVideo + 1)
    }
    if (isDownSwipe && currentVideo > 0) {
      setCurrentVideo(currentVideo - 1)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && currentVideo > 0) {
        setCurrentVideo(currentVideo - 1)
      } else if (e.key === "ArrowDown" && currentVideo < mockVideos.length - 1) {
        setCurrentVideo(currentVideo + 1)
      } else if (e.key === " ") {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentVideo, isPlaying])

  const handleLike = (videoId: string) => {
    setLikedVideos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
      }
      return newSet
    })
  }

  const currentVideoData = mockVideos[currentVideo]

  return (
    <div
      ref={containerRef}
      className="relative h-full bg-black overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-1">
        {mockVideos.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full transition-all ${index === currentVideo ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        <img
          src={currentVideoData.video_url || "/placeholder.svg"}
          alt="Dare video"
          className="w-full h-full object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Play/Pause Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="w-16 h-16 rounded-full bg-black/20 hover:bg-black/40 text-white"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
        </Button>
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-12">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold text-xl">
            <span className="bg-gradient-primary bg-clip-text text-transparent">DareMe</span>
          </div>
          <Button
            onClick={onSendDare}
            className="bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-full px-6 py-2 font-semibold animate-pulse-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Send Dare
          </Button>
        </div>
      </div>

      {currentVideo === 0 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 text-white animate-fade-in">
            <p className="text-sm">👆 Swipe up/down or use arrow keys to browse dares</p>
          </div>
        </div>
      )}

      {/* User Info & Dare Text */}
      <div className="absolute bottom-24 left-4 right-20 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12 border-2 border-white">
            <AvatarImage src={currentVideoData.user.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {currentVideoData.user.display_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-semibold text-lg">{currentVideoData.user.display_name}</p>
            <p className="text-white/80 text-sm">@{currentVideoData.user.username}</p>
          </div>
          <Button
            size="sm"
            className="ml-auto bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full"
          >
            Follow
          </Button>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <p className="text-white font-bold text-lg mb-2">🎯 Current Dare:</p>
          <p className="text-white text-base leading-relaxed">{currentVideoData.dare_text}</p>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 z-10 flex flex-col gap-6">
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className={`w-14 h-14 rounded-full ${
              likedVideos.has(currentVideoData.id)
                ? "bg-primary text-white animate-bounce-in"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
            onClick={() => handleLike(currentVideoData.id)}
          >
            <Heart className={`w-6 h-6 ${likedVideos.has(currentVideoData.id) ? "fill-current" : ""}`} />
          </Button>
          <span className="text-white text-sm font-semibold mt-1">
            {likedVideos.has(currentVideoData.id) ? currentVideoData.likes_count + 1 : currentVideoData.likes_count}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-14 h-14 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <span className="text-white text-sm font-semibold mt-1">{currentVideoData.comments_count}</span>
        </div>

        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-14 h-14 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <Share className="w-6 h-6" />
          </Button>
          <span className="text-white text-sm font-semibold mt-1">{currentVideoData.shares_count}</span>
        </div>
      </div>

      {/* Record Button */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={onRecord}
          className="w-16 h-16 rounded-full bg-gradient-energy hover:bg-gradient-energy/90 text-white shadow-2xl animate-float"
        >
          <div className="w-8 h-8 rounded-full bg-white/90" />
        </Button>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2">
        <span className="text-white/60 text-xs">{currentVideo + 1}</span>
        <div className="flex gap-1">
          {mockVideos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideo(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentVideo ? "bg-white w-4" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        <span className="text-white/60 text-xs">of {mockVideos.length}</span>
      </div>
    </div>
  )
}
