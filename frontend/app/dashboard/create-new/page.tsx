'use client'

import { useState } from 'react'
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

interface FormData {
  topic: string
  imageStyle: string
  duration: string
}

interface VideoContentItem {
  imagePrompt: string
  contextText: string
}

export default function CreateNew() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({} as FormData)
  const [videoContent, setVideoContent] = useState<VideoContentItem[]>([])
  const [audioFileUrl, setAudioFileUrl] = useState<string>()

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
    const prompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each scene and give me result in JSON format with ImagePrompt and ContextText as field, No Plain text`
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/generate-content`, {
        input: prompt,
      })
      .then((resp) => {
        setVideoContent(resp.data)
        GenerateAudioFile(resp.data)
      })
    setIsLoading(false)
  }

  const GenerateAudioFile = async (videoContentData: VideoContentItem[]) => {
    let script = ''
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/generate-audio`, {
      input: "test from the frontend"
    }).then(resp => {
      setAudioFileUrl(resp.data.downloadUrl)
    })
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
      <Loading loading={isLoading} />
    </div>
  )
}
