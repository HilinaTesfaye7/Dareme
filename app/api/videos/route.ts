import { NextResponse } from "next/server"

// Mock video data for demo
const mockVideos = [
  {
    id: "1",
    video_url: "/teen-doing-dance-dare.jpg",
    dare_text: "Do the most epic dance move you know for 30 seconds!",
    likes_count: 1247,
    comments_count: 89,
    shares_count: 34,
    created_at: "2024-01-15T10:30:00Z",
    profiles: {
      id: "user1",
      username: "danceking23",
      avatar_url: "/teen-avatar.png",
      display_name: "Alex Chen",
    },
    dares: {
      id: "dare1",
      dare_text: "Do the most epic dance move you know for 30 seconds!",
    },
  },
  {
    id: "2",
    video_url: "/teen-doing-funny-challenge.jpg",
    dare_text: "Try to say the alphabet backwards while doing jumping jacks!",
    likes_count: 892,
    comments_count: 56,
    shares_count: 23,
    created_at: "2024-01-14T15:45:00Z",
    profiles: {
      id: "user2",
      username: "funnygirl",
      avatar_url: "/teen-avatar.png",
      display_name: "Maya Rodriguez",
    },
    dares: {
      id: "dare2",
      dare_text: "Try to say the alphabet backwards while doing jumping jacks!",
    },
  },
  {
    id: "3",
    video_url: "/placeholder-085xr.png",
    dare_text: "Create a 10-second story using only objects around you!",
    likes_count: 2156,
    comments_count: 134,
    shares_count: 67,
    created_at: "2024-01-13T09:20:00Z",
    profiles: {
      id: "user3",
      username: "creativekid",
      avatar_url: "/teen-avatar.png",
      display_name: "Jordan Smith",
    },
    dares: {
      id: "dare3",
      dare_text: "Create a 10-second story using only objects around you!",
    },
  },
]

export async function GET() {
  try {
    return NextResponse.json({ videos: mockVideos })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
