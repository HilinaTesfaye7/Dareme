"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Send, Camera, Sparkles, AlertCircle } from "lucide-react"

interface RecordDareScreenProps {
  onBack: () => void
  dareText?: string
  dareId?: string
}

const arFilters = [
  { id: 1, name: "Sparkles", icon: "✨" },
  { id: 2, name: "Hearts", icon: "💕" },
  { id: 3, name: "Rainbow", icon: "🌈" },
  { id: 4, name: "Fire", icon: "🔥" },
  { id: 5, name: "Crown", icon: "👑" },
]

export function RecordDareScreen({
  onBack,
  dareText = "Dance in public for 30 seconds!",
  dareId,
}: RecordDareScreenProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt")

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    initializeCamera()
    return () => {
      cleanup()
    }
  }, [])

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      })

      streamRef.current = stream
      setCameraPermission("granted")

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Camera access denied:", err)
      setCameraPermission("denied")
      setError("Camera access is required to record dares")
    }
  }

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const handleRecord = () => {
    if (!streamRef.current) {
      setError("Camera not available")
      return
    }

    if (!isRecording) {
      recordedChunksRef.current = []

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp9",
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        setHasRecorded(true)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 30) {
            handleStopRecording()
            return 30
          }
          return prev + 1
        })
      }, 1000)
    } else {
      handleStopRecording()
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const handleRetry = () => {
    setHasRecorded(false)
    setRecordingTime(0)
    setIsRecording(false)
    setError(null)
    recordedChunksRef.current = []
  }

  const handleSubmit = async () => {
    if (recordedChunksRef.current.length === 0) {
      setError("No video recorded")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Create video blob and URL
      const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
      const videoUrl = URL.createObjectURL(videoBlob)
      
      // Add to video store
      const { videoStore } = await import('@/lib/video-store')
      videoStore.addVideo({
        video_url: videoUrl,
        dare_text: dareText,
        user: {
          username: "you",
          display_name: "You",
          avatar_url: "/teen-avatar.png"
        }
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      onBack()
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload video")
    } finally {
      setIsUploading(false)
    }
  }

  if (cameraPermission === "denied") {
    return (
      <div className="h-full bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Camera Access Required</h2>
          <p className="text-white/80 mb-6">Please allow camera access to record your dare video</p>
          <Button onClick={onBack} className="bg-gradient-primary hover:bg-gradient-primary/90">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-black relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "scaleX(-1)" }} // Mirror effect for front camera
      />

      {/* Filter overlay */}
      {selectedFilter && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-overlay" />
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-12">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <p className="text-white text-sm opacity-80">Recording Dare</p>
            {isRecording && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white font-mono text-lg">{recordingTime}s</span>
              </div>
            )}
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Dare Prompt */}
      <div className="absolute top-24 left-4 right-4 z-10">
        <div className="bg-gradient-primary rounded-2xl p-4 animate-bounce-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🎯</div>
            <span className="text-white font-bold">Your Dare:</span>
          </div>
          <p className="text-white text-lg font-semibold">{dareText}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-40 left-4 right-4 z-10">
          <div className="bg-red-500/90 rounded-2xl p-4">
            <p className="text-white font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* AR Filters */}
      <div className="absolute top-40 right-4 z-10">
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <Sparkles className="w-6 h-6" />
          </Button>
          {arFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(selectedFilter === filter.id ? null : filter.id)}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl transition-all ${
                selectedFilter === filter.id
                  ? "border-primary scale-110 bg-primary/20"
                  : "border-white/30 hover:border-white/60 bg-white/10"
              }`}
            >
              {filter.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-10 px-4">
        {!hasRecorded ? (
          <div className="flex items-center justify-center gap-8">
            <Button
              variant="ghost"
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <Camera className="w-6 h-6" />
            </Button>

            <Button
              onClick={handleRecord}
              disabled={cameraPermission !== "granted"}
              className={`w-20 h-20 rounded-full border-4 border-white transition-all ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse-glow"
                  : "bg-gradient-primary hover:bg-gradient-primary/90"
              }`}
            >
              <div
                className={`rounded-full transition-all ${isRecording ? "w-6 h-6 bg-white" : "w-12 h-12 bg-white/90"}`}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <Button
              onClick={handleRetry}
              disabled={isUploading}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retry
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isUploading}
              className="bg-gradient-success hover:bg-gradient-success/90 text-white rounded-full px-8 py-3 font-semibold animate-bounce-in"
            >
              <Send className="w-5 h-5 mr-2" />
              {isUploading ? "Uploading..." : "Submit Dare"}
            </Button>
          </div>
        )}
      </div>

      {/* Recording Progress */}
      {isRecording && (
        <div className="absolute bottom-32 left-4 right-4 z-10">
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-1000"
                style={{ width: `${(recordingTime / 30) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
