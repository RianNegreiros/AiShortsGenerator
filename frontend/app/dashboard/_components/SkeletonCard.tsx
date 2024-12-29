import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard({ count = 5 }) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className='h-[450px] w-[300px] rounded-xl' />
      ))}
    </div>
  )
}
