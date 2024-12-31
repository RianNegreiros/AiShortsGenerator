export type VideoContentItem = {
  imagePrompt: string
  contextText: string
}

export type TranscriptSegment = {
  confidence: number
  start: number
  end: number
  text: string
  channel: string | null
  speaker: string | null
}

export type VideoData = {
  id?: number
  videoContent: VideoContentItem[]
  audioFileUrl: string
  captions: TranscriptSegment[]
  images: string[]
  outputFile?: string
  renderId?: string
}
