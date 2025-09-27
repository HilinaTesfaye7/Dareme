"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  src: string
  isActive: boolean
  isPlaying: boolean
  onPlayPause: () => void
  className?: string
}

export function VideoPlayer({ src, isActive, isPlaying, onPlayPause, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive && isPlaying) {
      video.play().catch(() => {
        // Handle autoplay restrictions
      })
    } else {
      video.pause()
    }
  }, [isActive, isPlaying])

  const handleLoadedData = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        onLoadedData={handleLoadedData}
        onClick={onPlayPause}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-16 h-16 rounded-full bg-black/20 hover:bg-black/40 text-white"
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
        </Button>
      </div>
    </div>
  )
}