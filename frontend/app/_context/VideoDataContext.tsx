'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface VideoDataContextType {
  videoData: VideoData
  setVideoData: React.Dispatch<React.SetStateAction<VideoData>>
}

export const VideoDataContext = createContext<VideoDataContextType | undefined>(
  undefined,
)

interface VideoContentItem {
  imagePrompt: string
  contextText: string
}

interface TranscriptSegment {
  confidence: number
  start: number
  end: number
  text: string
  channel: string | null
  speaker: string | null
}

interface VideoData {
  videoContent: VideoContentItem[]
  audioFileUrl?: string
  captions?: TranscriptSegment[]
  images?: string[]
}

export function VideoDataProvider({ children }: { children: ReactNode }) {
  const [videoData, setVideoData] = useState<VideoData>({
    videoContent: [],
    audioFileUrl: undefined,
    captions: undefined,
    images: undefined,
  })

  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoDataContext.Provider>
  )
}

export function useVideoData() {
  const context = useContext(VideoDataContext)
  if (!context) {
    throw new Error('useVideoData must be used within a VideoDataProvider')
  }
  return context
}
