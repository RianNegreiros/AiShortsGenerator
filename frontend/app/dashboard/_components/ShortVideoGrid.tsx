'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, PlusCircle } from 'lucide-react'
import VideoCard from './VideoCard'
import axios from 'axios'
import Link from 'next/link'
import { VideoData } from '@/app/lib/interface'
import { SkeletonCard } from './SkeletonCard'

interface ShortVideoGridData extends VideoData {
  id: number
  createdAt: string
}

export default function ShortVideoGrid() {
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState<ShortVideoGridData[]>([])

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
    return <SkeletonCard />
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
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {videos.map((video, index) => (
        <VideoCard
          key={index}
          videoContent={video.videoContent}
          audioFileUrl={video.audioFileUrl}
          captions={video.captions}
          images={video.images}
          id={video.id}
        />
      ))}
    </div>
  )
}
