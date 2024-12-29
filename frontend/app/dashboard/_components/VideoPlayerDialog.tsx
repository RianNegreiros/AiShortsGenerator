import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Player } from '@remotion/player'
import { MyComposition } from '@/remotion/Composition'
import Link from 'next/link'
import { VideoData } from '@/app/lib/interface'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface VideoPlayerDialogProps {
  video: VideoData | null
  isOpen: boolean
  onClose: () => void
}

export function VideoPlayerDialog({
  video,
  isOpen,
  onClose,
}: VideoPlayerDialogProps) {
  const [durationInFrame, setDurationInFrame] = useState(700)
  const router = useRouter()

  const exportVideo = async () => {
    if (!video) return
    try {
      const result = await axios.post('/api/render-video', {
        audioFileUrl: video.audioFileUrl,
        captions: video.captions,
        images: video.images,
      })
      console.log('Video Rendered:', result.data)
    } catch (error) {
      console.error('Error rendering video:', error)
    }
  }

  const handleCancel = () => {
    onClose()
    router.push('/dashboard')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-xl p-0'>
        <DialogHeader className='border-b p-4'>
          <DialogTitle className='text-lg font-semibold'>
            Generated Video
          </DialogTitle>
          <DialogDescription>
            Preview your generated video. You can export or cancel.
          </DialogDescription>
        </DialogHeader>

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
                setDurationInFrame: (frameValue: number) =>
                  setDurationInFrame(frameValue),
              }}
            />
          )}
        </div>

        <DialogFooter className='flex items-center justify-end gap-4 border-t p-4'>
          <Link href={'/dashboard'}>
            <Button type='button' variant='secondary' onClick={handleCancel}>
              Cancel
            </Button>
          </Link>
          <Button type='button' onClick={exportVideo}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
