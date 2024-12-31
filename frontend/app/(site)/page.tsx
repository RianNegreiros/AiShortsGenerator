import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
      <div className='w-full max-w-3xl'>
        <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
          Create Stunning AI-Generated Shorts in Seconds
        </h1>
        <p className='mt-4 text-lg text-muted-foreground sm:text-xl'>
          Transform your content with AI-powered short videos that engage and
          captivate your audience. No video editing skills required!
        </p>
        <Button asChild className='mt-8 w-full sm:w-auto'>
          <Link href='/dashboard/create-new'>Start Generating Shorts</Link>
        </Button>
        <p className='mt-4 text-sm text-muted-foreground'>
          Save time and boost engagement with AI technology.
        </p>
      </div>
    </div>
  )
}
