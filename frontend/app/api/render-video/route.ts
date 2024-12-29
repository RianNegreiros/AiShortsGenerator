import { inngest } from '@/inngest/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { audioFileUrl, captions, images } = await req.json()

  await inngest.send({
    name: 'render-video/short-video',
    data: {
      audioFileUrl: audioFileUrl,
      captions: captions,
      images: images,
    },
  })

  return NextResponse.json('Inngest Function Trigged')
}
