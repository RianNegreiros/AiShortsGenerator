import { TranscriptSegment, VideoData } from '@/app/lib/interface'
import { useEffect, useState } from 'react'
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

export const MyComposition = ({
  audioFileUrl,
  captions,
  images,
}: VideoData) => {
  const { fps } = useVideoConfig()
  const frame = useCurrentFrame()
  const [durationFrame, setDurationFrame] = useState<number | null>(null)

  useEffect(() => {
    if (captions.length > 0) {
      const lastSegment = captions[captions.length - 1]
      const calculatedDurationFrame = (lastSegment.end / 1000) * fps
      setDurationFrame(calculatedDurationFrame)
    }
  }, [captions, fps])

  if (durationFrame === null) {
    return null
  }

  const getCurrentCaption = () => {
    const currentTime = (frame / 30) * 1000
    const currentCaption = captions.find(
      (word: TranscriptSegment) =>
        currentTime >= word.start && currentTime <= word.end,
    )
    return currentCaption ? currentCaption.text : ''
  }

  return (
    <AbsoluteFill>
      {images.map((item, index) => {
        const key = item || `image-${index}`
        const startTime = (index * durationFrame) / images.length
        const duration = durationFrame
        const scale = interpolate(
          frame,
          [startTime, startTime + duration / 2, startTime + duration],
          [1, 1.2, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )

        return (
          <Sequence key={key} from={startTime} durationInFrames={durationFrame}>
            <AbsoluteFill
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Img
                src={item}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${scale})`,
                }}
              />
              <AbsoluteFill
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  fontSize: '1.25rem',
                  color: 'white',
                  position: 'absolute',
                  top: undefined,
                  bottom: 0,
                  height: '200px',
                }}
              >
                <p>{getCurrentCaption()}</p>
              </AbsoluteFill>
            </AbsoluteFill>
          </Sequence>
        )
      })}
      <Audio src={audioFileUrl} />
    </AbsoluteFill>
  )
}
