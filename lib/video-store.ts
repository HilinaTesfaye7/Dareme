interface RecordedVideo {
  id: string
  video_url: string
  dare_text: string
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
  user: {
    username: string
    display_name: string
    avatar_url: string
  }
}

class VideoStore {
  private videos: RecordedVideo[] = []
  private listeners: (() => void)[] = []
  private readonly STORAGE_KEY = 'dareme-videos'

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.videos = JSON.parse(stored)
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.videos))
    }
  }

  addVideo(video: Omit<RecordedVideo, 'id' | 'likes_count' | 'comments_count' | 'shares_count' | 'created_at'>) {
    const newVideo: RecordedVideo = {
      ...video,
      id: Date.now().toString(),
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: new Date().toISOString(),
    }
    
    this.videos.unshift(newVideo)
    this.saveToStorage()
    this.notifyListeners()
    return newVideo
  }

  getVideos(): RecordedVideo[] {
    return [...this.videos]
  }

  getUserVideos(username: string): RecordedVideo[] {
    return this.videos.filter(video => video.user.username === username)
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }
}

export const videoStore = new VideoStore()
export type { RecordedVideo }