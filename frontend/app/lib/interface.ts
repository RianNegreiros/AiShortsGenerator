export interface VideoContentItem {
  imagePrompt: string
  contextText: string
}

export interface TranscriptSegment {
  confidence: number
  start: number
  end: number
  text: string
  channel: string | null
  speaker: string | null
}

export interface VideoData {
  id?: number
  videoContent: VideoContentItem[]
  audioFileUrl: string
  captions: TranscriptSegment[]
  images: string[]
  outputFile?: string
  renderId?: string
}
