import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonCard = ({ count = 5 }) => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {Array.from({ length: count }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={index} className='h-[450px] w-[300px] rounded-xl' />
      ))}
    </div>
  )
}
