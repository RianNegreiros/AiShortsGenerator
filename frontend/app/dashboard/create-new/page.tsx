'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import axios from 'axios'
import Loading from './_components/Loading'
import { useVideoData } from '@/app/_context/VideoDataContext'

interface FormData {
  topic: string
  imageStyle: string
  duration: string
}

interface VideoContentItem {
  imagePrompt: string
  contextText: string
}

interface TranscriptSegment {
  confidence: number
  start: number
  end: number
  text: string
  channel: string | null
  speaker: string | null
}

interface VideoData {
  videoContent: VideoContentItem[]
  audioFileUrl?: string
  captions?: TranscriptSegment[]
  images?: string[]
}

export default function CreateNew() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(
    'Generating your video...',
  )
  const [progress, setProgress] = useState(65)
  const [formData, setFormData] = useState<FormData>({} as FormData)
  const [videoContent, setVideoContent] = useState<VideoContentItem[]>([])
  const [audioFileUrl, setAudioFileUrl] = useState<string>()
  const [captions, setCaptions] = useState<TranscriptSegment[]>()
  const [images, setImages] = useState<string[]>()
  const { videoData, setVideoData } = useVideoData()

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
    const prompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each scene and give me result in JSON format with ImagePrompt and ContextText as field, No Plain text`
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/generate-content`,
      {
        input: prompt,
      },
    )

    if (resp.data) {
      setVideoData((prev: VideoData) => ({
        ...prev,
        videoContent: resp.data,
      }))
      setVideoContent(resp.data)
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
      setVideoData((prev: VideoData) => ({
        ...prev,
        audioFileUrl: resp.data,
      }))
      setAudioFileUrl(resp.data)
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
      setVideoData((prev: VideoData) => ({
        ...prev,
        captions: resp.data,
      }))
      setCaptions(resp.data)
      await GenerateImage(videoContentData)
    }
  }

  const SaveVideoToDatabase = async (videoData: VideoData) => {
    setLoadingMessage('Saving your video to the database...')
    setProgress(99)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/save-video`,
        videoData,
      )
    } catch (error) {
      console.error('Error saving video:', error)
    }
  }

  const GenerateImage = async (videoContent: VideoContentItem[]) => {
    setLoadingMessage('Generating images...')
    setProgress(90)
    let responseImages: string[] = []
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
    setVideoData((prev: VideoData) => ({
      ...prev,
      images: responseImages,
    }))
    setImages(responseImages)
    await SaveVideoToDatabase(videoData)
    setProgress(100)
    setIsLoading(false)
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
    </div>
  )
}
