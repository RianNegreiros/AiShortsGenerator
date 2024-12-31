import { deleteRender } from '@remotion/lambda/client'
import axios from 'axios'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const bucketName = process.env.REMOTION_AWS_BUCKET_NAME

export const DELETE = async (req: NextRequest) => {
  if (!bucketName) {
    return NextResponse.json(
      { error: 'BucketName not defined' },
      { status: 500 },
    )
  }

  const { renderId, videoId } = await req.json()

  console.log(renderId)

  try {
    if (renderId) {
      await deleteRender({
        bucketName,
        region: 'us-east-1',
        renderId,
      })
    }

    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/videos/${videoId}`)

    return NextResponse.json(
      { message: 'Video deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { error: 'Failed to delete video', details: error },
      { status: 500 },
    )
  }
}
