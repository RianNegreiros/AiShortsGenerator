'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

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
];

type SelectStyleProps = {
  onUserSelect: (fieldName: string, fieldValue: string) => void;
};

export default function SelectStyle({ onUserSelect }: SelectStyleProps) {
  const [selectOption, setSelectOption] = useState('');
  return (
    <div className='space-y-2'>
      <Label htmlFor='style'>Style</Label>
      <div
        id='style'
        className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'
      >
        {options.map((item, index) => (
          <Card
            onClick={() => {
              setSelectOption(item.name);
              onUserSelect('imageStyle', item.name);
            }}
            key={index}
            className={`cursor-pointer transition-all hover:scale-105 ${selectOption == item.name && 'border-4 border-blue-700 opacity-70 dark:border-white'}`}
          >
            <div className='relative aspect-square w-full'>
              <div className='absolute inset-0'>
                <Image
                  alt='Image'
                  className='h-auto w-full rounded-lg object-cover'
                  height='1024'
                  src={item.image}
                  width='1024'
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
  );
}
