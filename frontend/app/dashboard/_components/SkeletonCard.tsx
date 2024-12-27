import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Skeleton className='h-[450px] w-[300px] rounded-xl' />
      <Skeleton className='h-[450px] w-[300px] rounded-xl' />
      <Skeleton className='h-[450px] w-[300px] rounded-xl' />
      <Skeleton className='h-[450px] w-[300px] rounded-xl' />
    </div>
  )
}
