import { Button } from '@/components/ui/button'
import { ImageCard } from '../components/ImageCard'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const images = [
  { src: 'https://placehold.co/300x200/png', alt: 'Image 1', title: 'Image 1' },
  { src: 'https://placehold.co/300x200/png', alt: 'Image 2', title: 'Image 2' },
  { src: 'https://placehold.co/300x200/png', alt: 'Image 3', title: 'Image 3' },
  { src: 'https://placehold.co/300x200/png', alt: 'Image 4', title: 'Image 4' },
  { src: 'https://placehold.co/300x200/png', alt: 'Image 5', title: 'Image 5' },
  { src: 'https://placehold.co/300x200/png', alt: 'Image 6', title: 'Image 6' },
]

export default function DashboardPage() {
  return (
    <div className='p-6'>
      <div className='flex justify-between'>
        <h1 className='mb-6 text-2xl font-bold'>Dashboard</h1>
        <Link href={'/dashboard/create-new'}>
          <Button>New {<Plus />}</Button>
        </Link>
      </div>
      {images.length === 0 ? (
        <div className='flex h-64 flex-col items-center justify-center'>
          <span className='mb-2 text-gray-600'>No videos available</span>
          <Link href={'/dashboard/create-new'}>
            <Button variant={'outline'}>Create New Short Video</Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {images.map((image, index) => (
            <ImageCard key={index} {...image} />
          ))}
        </div>
      )}
    </div>
  )
}
