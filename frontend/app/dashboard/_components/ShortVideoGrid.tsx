'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'
import { VideoData } from '@/app/lib/interface'
import { SkeletonCard } from './SkeletonCard'
import { MyComposition } from '@/remotion/Composition'
import { Thumbnail } from '@remotion/player'
import { VideoPlayerDialog } from '@/app/components/VideoPlayerDialog'

interface ShortVideoGridData extends VideoData {
  createdAt: string
}

export default function ShortVideoGrid() {
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState<ShortVideoGridData[]>([])
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const GetVideos = async () => {
    setLoading(true)
    const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/videos`)
    if (resp.data) {
      const sortedVideos = resp.data.sort(
        (a: ShortVideoGridData, b: ShortVideoGridData) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      setVideos(sortedVideos)
    }

    setLoading(false)
  }

  useEffect(() => {
    GetVideos()
  }, [])

  if (loading) {
    return <SkeletonCard count={10} />
  }

  if (videos.length === 0) {
    return (
      <div className='flex h-64 flex-col items-center justify-center'>
        <p className='mb-4 text-xl'>No short videos yet</p>
        <Link href={'/dashboard/create-new'}>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' /> Create New Short Video
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {videos.map((video, index) => (
          <button
            key={index}
            className='relative aspect-square h-[450px] w-[300px] transform overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setSelectedVideo(video)}
          >
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
          </button>
        ))}
      </div>
      <VideoPlayerDialog
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        video={selectedVideo}
        refreshVideos={GetVideos}
      />
    </>
  )
}
