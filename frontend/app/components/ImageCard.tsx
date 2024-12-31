import Image from 'next/image'

import { Card, CardContent, CardFooter } from '@/components/ui/card'

type ImageCardProps = {
  src: string
  alt: string
  title: string
}

export function ImageCard({ src, alt, title }: ImageCardProps) {
  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-0'>
        <Image
          src={src}
          alt={alt}
          width={300}
          height={200}
          className='w-full object-cover'
        />
      </CardContent>
      <CardFooter className='p-2'>
        <p className='text-sm font-medium'>{title}</p>
      </CardFooter>
    </Card>
  )
}
