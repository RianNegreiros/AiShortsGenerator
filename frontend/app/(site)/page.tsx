import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
      <div className='w-full max-w-3xl'>
        <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
          Welcome to Our Platform
        </h1>
        <p className='mt-4 text-lg text-muted-foreground sm:text-xl'>
          Discover amazing features and boost your productivity.
        </p>
        <Button asChild className='mt-8 w-full sm:w-auto'>
          <Link href='/dashboard'>Get Started</Link>
        </Button>
      </div>
    </div>
  )
}
