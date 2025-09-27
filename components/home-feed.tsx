"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VideoPlayer } from "@/components/video-player"
import { videoStore, type RecordedVideo } from "@/lib/video-store"

interface HomeFeedProps {
  onSendDare: () => void
  onRecord: (dareText: string) => void
}

const mockVideos = [
  {
    id: "1",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
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
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
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
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
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
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const lastVideoRef = useRef(currentVideo)
  const [recordedVideos, setRecordedVideos] = useState<RecordedVideo[]>([])

  const minSwipeDistance = 50
  const allVideos = [...recordedVideos, ...mockVideos]

  const handleScrollStart = useCallback(() => {
    setIsScrolling(true)
    setIsPlaying(false)
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  const changeVideo = useCallback((newIndex: number, direction: 'up' | 'down') => {
    if (newIndex >= 0 && newIndex < allVideos.length) {
      setScrollDirection(direction)
      setCurrentVideo(newIndex)
      lastVideoRef.current = newIndex
    }
  }, [allVideos.length])

  const handleScrollEnd = useCallback(() => {
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
      setIsPlaying(true)
    }, 150)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
    handleScrollStart()
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isUpSwipe = distance > minSwipeDistance
    const isDownSwipe = distance < -minSwipeDistance

    if (isUpSwipe && currentVideo < allVideos.length - 1) {
      changeVideo(currentVideo + 1, 'up')
    }
    if (isDownSwipe && currentVideo > 0) {
      changeVideo(currentVideo - 1, 'down')
    }
    
    handleScrollEnd()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && currentVideo > 0) {
        handleScrollStart()
        changeVideo(currentVideo - 1, 'down')
        handleScrollEnd()
      } else if (e.key === "ArrowDown" && currentVideo < allVideos.length - 1) {
        handleScrollStart()
        changeVideo(currentVideo + 1, 'up')
        handleScrollEnd()
      } else if (e.key === " ") {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      handleScrollStart()
      
      if (e.deltaY > 0 && currentVideo < allVideos.length - 1) {
        changeVideo(currentVideo + 1, 'up')
      } else if (e.deltaY < 0 && currentVideo > 0) {
        changeVideo(currentVideo - 1, 'down')
      }
      
      handleScrollEnd()
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("wheel", handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("wheel", handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [currentVideo, isPlaying, handleScrollStart, handleScrollEnd, changeVideo])

  useEffect(() => {
    if (scrollDirection) {
      const timer = setTimeout(() => setScrollDirection(null), 400)
      return () => clearTimeout(timer)
    }
  }, [scrollDirection])

  useEffect(() => {
    const unsubscribe = videoStore.subscribe(() => {
      setRecordedVideos(videoStore.getVideos())
    })
    setRecordedVideos(videoStore.getVideos())
    return unsubscribe
  }, [])

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

  const currentVideoData = allVideos[currentVideo]

  return (
    <div
      ref={containerRef}
      className="relative h-full bg-black overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >


      <div className={`absolute inset-0 video-transition ${
        isScrolling ? 'scrolling' : ''
      } ${
        scrollDirection === 'up' ? 'animate-video-slide-up' : 
        scrollDirection === 'down' ? 'animate-video-slide-down' : ''
      }`}>
        <VideoPlayer
          src={currentVideoData.video_url}
          isActive={true}
          isPlaying={isPlaying && !isScrolling}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          className="transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-12">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold text-xl">
            <span className="bg-gradient-primary bg-clip-text text-transparent"></span>
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
            <p className="text-sm font-medium"></p>
            <p className="text-xs mt-1 opacity-80"></p>
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
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={() => onRecord(currentVideoData.dare_text)}
          className="w-16 h-16 rounded-full bg-gradient-energy hover:bg-gradient-energy/90 text-white shadow-2xl animate-float"
        >
          <div className="w-8 h-8 rounded-full bg-white/90" />
        </Button>
      </div>


    </div>
  )
}
