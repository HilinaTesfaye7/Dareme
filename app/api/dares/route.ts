import { type NextRequest, NextResponse } from "next/server"

// Mock dares data for demo
const mockDares = [
  {
    id: "dare1",
    dare_text: "Do the most epic dance move you know for 30 seconds!",
    sender_id: "user1",
    target_type: "global",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "dare2",
    dare_text: "Try to say the alphabet backwards while doing jumping jacks!",
    sender_id: "user2",
    target_type: "friends",
    status: "active",
    created_at: "2024-01-14T15:45:00Z",
  },
  {
    id: "dare3",
    dare_text: "Create a 10-second story using only objects around you!",
    sender_id: "user3",
    target_type: "random",
    status: "active",
    created_at: "2024-01-13T09:20:00Z",
  },
  {
    id: "dare4",
    dare_text: "Sing 'Happy Birthday' in an opera voice",
    sender_id: "user1",
    target_type: "global",
    status: "active",
    created_at: "2024-01-12T14:15:00Z",
  },
  {
    id: "dare5",
    dare_text: "Do 10 jumping jacks while saying the alphabet",
    sender_id: "user2",
    target_type: "global",
    status: "active",
    created_at: "2024-01-11T11:30:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "global"

    let filteredDares = mockDares

    if (type === "trending") {
      filteredDares = mockDares.slice(0, 3) // Return top 3 for trending
    }

    return NextResponse.json({ dares: filteredDares })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch dares" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dare_text, target_type, target_user_id } = await request.json()

    if (!dare_text) {
      return NextResponse.json({ error: "Dare text is required" }, { status: 400 })
    }

    const mockDare = {
      id: `dare_${Date.now()}`,
      sender_id: "demo_user",
      dare_text,
      target_type: target_type || "global",
      target_user_id: target_user_id || null,
      status: "active",
      created_at: new Date().toISOString(),
    }

    console.log("[v0] Mock dare created:", mockDare)

    return NextResponse.json({ success: true, dare: mockDare })
  } catch (error) {
    console.error("Create dare error:", error)
    return NextResponse.json({ error: "Failed to create dare" }, { status: 500 })
  }
}
