import { TranscriptSegment, VideoData } from '@/app/lib/interface'
import { useState, useEffect } from 'react'
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

interface MyCompositionProps extends VideoData {
  setDurationInFrame: (frameValue: number) => void
}

export const MyComposition = ({
  audioFileUrl,
  captions,
  images,
  setDurationInFrame,
}: MyCompositionProps) => {
  const { fps } = useVideoConfig()
  const frame = useCurrentFrame()
  const [durationFrame, setDurationFrame] = useState<number | null>(null)

  useEffect(() => {
    if (captions.length > 0) {
      const lastSegment = captions[captions.length - 1]
      const calculatedDurationFrame = (lastSegment.end / 1000) * fps
      setDurationFrame(calculatedDurationFrame)
      setDurationInFrame(calculatedDurationFrame)
    }
  }, [captions, fps, setDurationInFrame])

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
    <AbsoluteFill className='bg-black'>
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
              style={{ justifyContent: 'center', alignItems: 'center' }}
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
                className='text-center text-lg text-white'
                style={{
                  top: undefined,
                  bottom: 0,
                  height: 100,
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