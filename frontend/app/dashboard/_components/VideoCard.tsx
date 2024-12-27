'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Thumbnail } from '@remotion/player'
import { MyComposition } from '@/remotion/Composition'
import { VideoPlayerDialog } from './VideoPlayerDialog'
import { VideoData } from '@/app/lib/interface'

interface VideoCardProps extends VideoData {
  id: number
}

export default function VideoCard(video: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Card
      className='h-[450px] w-[300px] transform cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:scale-105'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setOpenDialog(true)}
    >
      <CardContent className='relative p-0'>
        <Thumbnail
          component={MyComposition}
          compositionWidth={300}
          compositionHeight={450}
          frameToDisplay={30}
          durationInFrames={120}
          fps={30}
          inputProps={{
            ...video,
            setDurationInFrame: (a: any) => console.log(a),
          }}
        />
      </CardContent>
      <VideoPlayerDialog playVideo={openDialog} video={video} />
    </Card>
  )
}
