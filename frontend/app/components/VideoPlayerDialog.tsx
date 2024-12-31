import { useEffect, useState } from 'react'
import { Player } from '@remotion/player'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Download, Trash, X } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MyComposition } from '@/remotion/Composition'
import type { VideoData } from '@/app/lib/interface'

import Loading from './Loading'

type VideoPlayerDialogProps = {
  video: VideoData | null
  isOpen: boolean
  onClose: () => void
  refreshVideos?: () => void
}

export function VideoPlayerDialog({
  video,
  isOpen,
  onClose,
  refreshVideos,
}: VideoPlayerDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [outputFileUrl, setOutputFileUrl] = useState<string | null>(null)

  useEffect(() => {
    if (video?.outputFile) {
      setOutputFileUrl(video.outputFile)
    } else {
      setOutputFileUrl(null)
    }
  }, [video])

  if (!video) {
    return null
  }

  const durationInFrame =
    video.captions.length > 0
      ? Math.ceil((video.captions[video.captions.length - 1].end / 1000) * 30)
      : 700

  const exportVideo = async () => {
    if (!video) return
    setIsLoading(true)

    try {
      const result = await axios.post('/api/render-video', {
        id: video.id,
        audioFileUrl: video.audioFileUrl,
        captions: video.captions,
        images: video.images,
      })

      console.log('Video Rendered:', result.data)

      if (result.data.outputFile) {
        setOutputFileUrl(result.data.outputFile)
        window.open(result.data.outputFile, '_blank')
      }
    } catch (error) {
      console.error('Error rendering video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onClose()
    router.push('/dashboard')
  }

  const handleDelete = async () => {
    onClose()
    try {
      await axios.delete('/api/delete-video', {
        data: {
          videoId: video.id,
          renderId: video.renderId,
        },
      })
      if (refreshVideos) {
        refreshVideos()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-xl p-0'>
        <DialogHeader className='border-b p-4'>
          <DialogTitle className='text-lg font-semibold'>
            Generated Video
          </DialogTitle>
          <DialogDescription>
            Preview your generated video. You can export, delete or cancel to go
            back the dashboard.
          </DialogDescription>
        </DialogHeader>

        <Loading
          loading={isLoading}
          showProgress={false}
          message='Rendering video, please wait...'
        />
        <div className='flex justify-center p-4'>
          {video && (
            <Player
              className='h-auto w-full rounded-md shadow-md'
              component={MyComposition}
              durationInFrames={Number(durationInFrame.toFixed(0))}
              compositionWidth={300}
              compositionHeight={450}
              fps={30}
              controls
              inputProps={{
                ...video,
              }}
            />
          )}
        </div>

        <DialogFooter className='gap-4 border-t p-4 sm:justify-between'>
          <Button type='button' variant='destructive' onClick={handleDelete}>
            <Trash className='mr-2 size-4' />
            Delete
          </Button>
          <div className='flex space-x-2'>
            <Button type='button' variant='secondary' onClick={handleCancel}>
              <X className='mr-2 size-4' />
              Cancel
            </Button>
            {outputFileUrl ? (
              <Button
                type='button'
                onClick={() => window.open(outputFileUrl, '_blank')}
              >
                Open
              </Button>
            ) : (
              <Button type='button' onClick={exportVideo}>
                <Download className='mr-2 size-4' />
                Export
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
