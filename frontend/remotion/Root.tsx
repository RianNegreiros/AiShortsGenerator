import { Composition } from 'remotion'
import { VideoData } from '@/app/lib/interface'
import { MyComposition } from './Composition'

export const RemotionRoot = () => {
  return (
    <Composition
      id='shortVideo'
      component={MyComposition}
      durationInFrames={700}
      width={300}
      height={450}
      fps={30}
      controls
      inputProps={{}}
    />
  )
}
