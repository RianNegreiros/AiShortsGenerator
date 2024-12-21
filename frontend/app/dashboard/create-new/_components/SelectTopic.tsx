'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type SelectTopicProps = {
  onUserSelect: (fieldName: string, fieldValue: string) => void;
};

const options = [
  'Custom Prompt',
  'Random AI Story',
  'Historical Facts',
  'Fun Facts',
  'Motivational',
  'Scary Story',
];

export default function SelectTopic({ onUserSelect }: SelectTopicProps) {
  const [contentType, setContentType] = useState('');
  return (
    <div className='space-y-2'>
      <Label htmlFor='content-type'>Content Type</Label>
      <Select
        onValueChange={(value) => {
          setContentType(value);
          if (value !== 'Custom Prompt') {
            onUserSelect('topic', value);
          }
        }}
        value={contentType}
      >
        <SelectTrigger id='content-type'>
          <SelectValue placeholder='Select content type' />
        </SelectTrigger>
        <SelectContent>
          {options.map((item, index) => (
            <SelectItem key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {contentType == 'Custom Prompt' && (
        <Textarea
          onChange={(e) => onUserSelect('topic', e.target.value)}
          placeholder='Write your custom prompt'
        />
      )}
    </div>
  );
}
