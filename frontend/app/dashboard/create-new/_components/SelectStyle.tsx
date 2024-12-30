'use client'

import { useState } from 'react'
import { Card, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

const options = [
  {
    name: 'Realistic',
    image: '/images/realistic.png',
  },
  {
    name: 'Cartoon',
    image: '/images/cartoon.png',
  },
  {
    name: 'Comic',
    image: '/images/comic.png',
  },
  {
    name: 'WaterColor',
    image: '/images/watercolor.png',
  },
  {
    name: 'Drawing',
    image: '/images/drawing.png',
  },
  {
    name: 'Monochrome',
    image: '/images/monochrome.png',
  },
  {
    name: 'Oil Painting',
    image: '/images/oil-painting.png',
  },
  {
    name: 'Pixel Art',
    image: '/images/pixel-art.png',
  },
  {
    name: 'retro',
    image: '/images/retro.png',
  },
  {
    name: 'Surreal',
    image: '/images/surreal.png',
  },
]

type SelectStyleProps = {
  onUserSelect: (fieldName: string, fieldValue: string) => void
}

export default function SelectStyle({ onUserSelect }: SelectStyleProps) {
  const [selectOption, setSelectOption] = useState('')
  return (
    <div className='space-y-2'>
      <legend className='mb-4 text-lg font-semibold'>Image Style</legend>
      <div
        id='style'
        className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'
      >
        {options.map((item, index) => (
          <Card
            onClick={() => {
              setSelectOption(item.name)
              onUserSelect('imageStyle', item.name)
            }}
            key={index}
            className={`cursor-pointer transition-all ${selectOption === item.name
                ? 'border-4 border-black dark:border-white'
                : 'hover:scale-105'
              }`}
          >
            <div className='relative aspect-square w-full'>
              <div className='absolute inset-0'>
                <Image
                  alt='Image'
                  className={`h-auto w-full rounded-lg object-cover ${selectOption === item.name ? 'opacity-50' : 'opacity-100'
                    }`}
                  height='1024'
                  src={item.image}
                  width='1024'
                  priority
                />
              </div>
              <div className='absolute bottom-0 left-0 right-0 rounded-b-lg bg-black bg-opacity-75 p-2'>
                <CardTitle className='text-2xl font-bold text-white'>
                  {item.name}
                </CardTitle>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
