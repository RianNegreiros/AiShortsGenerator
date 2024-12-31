import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SelectDurationProps = {
  // eslint-disable-next-line no-unused-vars
  onUserSelect: (fieldName: string, fieldValue: string) => void
}

export default function SelectDuration({ onUserSelect }: SelectDurationProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='video-duration' className='text-lg font-semibold'>
        Video Duration
      </Label>
      <Select onValueChange={(value) => onUserSelect('duration', value)}>
        <SelectTrigger id='video-duration' name='duration'>
          <SelectValue placeholder='Select duration' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='15 seconds'>15 seconds</SelectItem>
          <SelectItem value='30 seconds'>30 seconds</SelectItem>
          <SelectItem value='60 seconds'>60 Seconds</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
