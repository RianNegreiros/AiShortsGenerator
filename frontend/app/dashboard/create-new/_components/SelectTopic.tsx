'use client'

import { useState } from 'react'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const options = [
  'Custom Prompt',
  'Random AI Story',
  'Historical Facts',
  'Fun Facts',
  'Science Facts',
  'Motivational',
  'Scary Story',
  'Adventure Story',
  'Fantasy Story',
  'Sci-Fi Story',
  'Steampunk Story',
  'Romance Story',
  'Mystery/Thriller Story',
  'Historical Fiction',
  'Poems',
  'Tech Trends',
  'Philosophical Quotes',
  'Space Exploration',
  'Mythology',
]

type SelectTopicProps = {
  // eslint-disable-next-line no-unused-vars
  onUserSelect: (fieldName: string, fieldValue: string) => void
}

export default function SelectTopic({ onUserSelect }: SelectTopicProps) {
  const [contentType, setContentType] = useState('')
  return (
    <div className='space-y-2'>
      <Label htmlFor='content-type' className='text-lg font-semibold'>
        Content Type
      </Label>
      <Select
        onValueChange={(value) => {
          setContentType(value)
          if (value !== 'Custom Prompt') {
            onUserSelect('topic', value)
          }
        }}
        value={contentType}
      >
        <SelectTrigger id='content-type' name='topic'>
          <SelectValue placeholder='Select content type' />
        </SelectTrigger>
        <SelectContent>
          {options.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {contentType === 'Custom Prompt' && (
        <Textarea
          onChange={(e) => onUserSelect('topic', e.target.value)}
          placeholder='Write your custom prompt'
        />
      )}
    </div>
  )
}
