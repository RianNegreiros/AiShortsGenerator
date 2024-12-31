import {
  getFunctions,
  getRenderProgress,
  renderMediaOnLambda,
} from '@remotion/lambda/client'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import axios from 'axios'

import type { VideoData } from '@/app/lib/interface'

const serveUrl = process.env.REMOTION_AWS_SERVE_URL

export const POST = async (req: NextRequest) => {
  if (serveUrl === undefined) {
    return NextResponse.json(
      { error: 'Serve URL not defined' },
      { status: 500 },
    )
  }

  const { id, audioFileUrl, captions, images }: VideoData = await req.json()

  try {
    const functions = await getFunctions({
      region: 'us-east-1',
      compatibleOnly: true,
    })

    if (functions.length === 0) {
      throw new Error('No compatible Lambda functions found.')
    }

    const functionName = functions[0].functionName
    const captionsDuration = captions[captions.length - 1].end / 1000
    const fps = 30
    const durationInFrames = Math.ceil(captionsDuration * fps)

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: 'us-east-1',
      functionName,
      serveUrl,
      composition: 'shortVideo',
      inputProps: {
        audioFileUrl,
        captions,
        images,
        durationInFrames,
      },
      codec: 'h264',
      maxRetries: 1,
      framesPerLambda: 100,
      privacy: 'public',
    })

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const progress = await getRenderProgress({
        renderId,
        bucketName,
        functionName,
        region: 'us-east-1',
      })

      if (progress.done) {
        const outputFile = progress.outputFile
        console.log('Render finished!', outputFile)
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/videos/${id}`, {
          outputFile,
          renderId,
        })
        return NextResponse.json({ outputFile: outputFile })
      }

      if (progress.fatalErrorEncountered) {
        console.error('Error encountered', progress.errors)
        return NextResponse.json({ error: progress.errors }, { status: 500 })
      }
    }
  } catch (error) {
    console.error('Error rendering video:', error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
