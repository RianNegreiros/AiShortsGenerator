import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SelectDurationProps = {
  onUserSelect: (fieldName: string, fieldValue: string) => void
}

export default function SelectDuration({ onUserSelect }: SelectDurationProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="duration">Duration</Label>
      <Select
        onValueChange={(value) => onUserSelect('duration', value)}
      >
        <SelectTrigger id="duration">
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30 seconds">30 seconds</SelectItem>
          <SelectItem value="60 seconds">60 Seconds</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}