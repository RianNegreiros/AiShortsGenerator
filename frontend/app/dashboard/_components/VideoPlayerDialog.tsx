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

interface VideoPlayerDialogProps {
  playVideo: boolean
  video: VideoData
}

export function VideoPlayerDialog({
  video,
  playVideo,
}: VideoPlayerDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [durationInFrame, setDurationInFrame] = useState(100)

  useEffect(() => {
    setIsOpen(playVideo)
  }, [playVideo])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                videoContent: video.videoContent,
                audioFileUrl: video.audioFileUrl,
                captions: video.captions,
                images: video.images,
                setDurationInFrame: (frameValue: number) =>
                  setDurationInFrame(frameValue),
              }}
            />
          )}
        </div>

        <DialogFooter className='flex items-center justify-end gap-4 border-t p-4'>
          <Link href={'/dashboard'}>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </Link>
          <Button type='button'>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
