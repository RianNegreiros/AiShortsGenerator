import { Composition, getInputProps } from 'remotion'
import { MyComposition } from './Composition'
import { VideoData } from '@/app/lib/interface'

const { video, durationInFrames } = getInputProps() as {
  video: VideoData
  durationInFrames: number
}

export const RemotionRoot = () => {
  return (
    <Composition
      id='shortVideo'
      component={MyComposition}
      durationInFrames={durationInFrames}
      width={300}
      height={450}
      fps={30}
      defaultProps={{
        ...video,
      }}
    />
  )
}
