import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("video") as File
    const dareText = formData.get("dareText") as string
    const dareId = formData.get("dareId") as string

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    // Upload video to Vercel Blob
    const timestamp = Date.now()
    const filename = `dare-videos/demo_user/${timestamp}-${file.name}`

    const blob = await put(filename, file, {
      access: "public",
    })

    const mockVideo = {
      id: `video_${timestamp}`,
      user_id: "demo_user",
      dare_id: dareId || null,
      video_url: blob.url,
      dare_text: dareText,
      status: "active",
      created_at: new Date().toISOString(),
    }

    console.log("[v0] Mock video created:", mockVideo)

    return NextResponse.json({
      success: true,
      video: {
        id: mockVideo.id,
        url: blob.url,
        dare_text: dareText,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
