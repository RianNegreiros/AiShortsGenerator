'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Loading from '@/app/components/Loading'
import { VideoPlayerDialog } from '@/app/components/VideoPlayerDialog'
import type { VideoContentItem, VideoData } from '@/app/lib/interface'

import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'

type FormData = {
  topic: string
  imageStyle: string
  duration: string
}

export default function CreateNew() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(
    'Generating your video...',
  )
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState<FormData>({} as FormData)
  const [playVideo, setPlayVideo] = useState(false)
  const [videoData, setVideoData] = useState<VideoData>({
    videoContent: [],
    audioFileUrl: '',
    captions: [],
    images: [],
  })

  useEffect(() => {
    if (
      videoData.videoContent.length > 0 &&
      videoData.audioFileUrl &&
      videoData.captions.length > 0 &&
      videoData.images.length > 0
    ) {
      SaveVideoToDatabase(videoData)
    }
  }, [videoData])

  const onHandleInputChange = (fieldName: string, fieldValue: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }))
  }

  const onCreateSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    getVideoContent()
  }

  const getVideoContent = async () => {
    setIsLoading(true)
    setLoadingMessage('Generating video content...')
    setProgress(20)

    const prompt = `Generate a script for a video lasting ${formData.duration} seconds on the topic '${formData.topic}'. For each scene, provide the following in JSON format: [{'ContextText': '<Description of the scene (concise and fitting the duration)>','ImagePrompt': '<AI image generation prompt in ${formData.imageStyle} style>'}] Ensure all fields are well-structured, and do not include plain text outside the JSON.`

    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/generate-content`,
      {
        input: prompt,
      },
    )

    if (resp.data) {
      setVideoData((prev) => {
        return {
          ...prev,
          videoContent: resp.data,
        }
      })
      await GenerateAudioFile(resp.data)
    }
  }

  const GenerateAudioFile = async (videoContentData: VideoContentItem[]) => {
    setLoadingMessage('Generating audio file...')
    setProgress(50)
    let script = ''
    videoContentData.forEach((item) => {
      script = script + item.contextText + ''
    })
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/generate-audio`,
      {
        input: script,
      },
    )
    if (resp.data) {
      setVideoData((prev) => {
        return {
          ...prev,
          audioFileUrl: resp.data,
        }
      })
      await GenerateCaptions(resp.data, videoContentData)
    }
  }

  const GenerateCaptions = async (
    fileUrl: string,
    videoContentData: VideoContentItem[],
  ) => {
    setLoadingMessage('Generating captions...')
    setProgress(75)
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/generate-captions`,
      {
        fileUrl,
      },
    )
    if (resp.data) {
      setVideoData((prev) => {
        return {
          ...prev,
          captions: resp.data,
        }
      })
      await GenerateImage(videoContentData)
    }
  }

  const SaveVideoToDatabase = async (videoData: VideoData) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/save-video`, {
        videoContent: videoData.videoContent,
        captions: videoData.captions,
        images: videoData.images,
        audioFileUrl: videoData.audioFileUrl,
      })
    } catch (error) {
      console.error('Error saving video:', error)
    }
  }

  const GenerateImage = async (videoContent: VideoContentItem[]) => {
    setLoadingMessage(
      'Generating images... This part can take a minute or two.',
    )
    setProgress(90)
    const responseImages: string[] = []
    for (const item of videoContent) {
      try {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/generate-image`,
          {
            prompt: item.imagePrompt,
          },
        )
        responseImages.push(resp.data)
      } catch (e) {
        console.log('Error:' + e)
      }
    }
    setVideoData((prev) => {
      return {
        ...prev,
        images: responseImages,
      }
    })
    setProgress(100)
    setIsLoading(false)
    setPlayVideo(true)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='mx-auto max-w-full'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            Create New Short Video
          </CardTitle>
        </CardHeader>
        <form onSubmit={onCreateSubmitHandler}>
          <CardContent className='space-y-4'>
            <SelectTopic onUserSelect={onHandleInputChange} />
            <SelectStyle onUserSelect={onHandleInputChange} />
            <SelectDuration onUserSelect={onHandleInputChange} />
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full'>
              Generate
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Loading
        loading={isLoading}
        progress={progress}
        message={loadingMessage}
      />
      <VideoPlayerDialog
        isOpen={playVideo}
        onClose={() => setPlayVideo(false)}
        video={videoData}
      />
    </div>
  )
}
