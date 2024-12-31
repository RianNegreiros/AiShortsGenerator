import { Progress } from '@/components/ui/progress'

type LoadingProps = {
  loading: boolean
  progress?: number
  message: string
  showProgress?: boolean
}

export default function Loading({
  loading,
  progress,
  message,
  showProgress = true,
}: LoadingProps) {
  if (!loading) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${loading ? 'flex' : 'hidden'}`}
    >
      <div className='flex flex-col items-center space-y-4'>
        <div className='size-12 animate-spin rounded-full border-4 border-gray-400 border-t-transparent' />
        <p className='text-white dark:text-gray-300'>{message}</p>

        {showProgress && progress !== undefined && (
          <Progress
            value={progress}
            max={100}
            className='mt-4 h-2 w-64 rounded-full bg-gray-300 dark:bg-gray-700'
          />
        )}
      </div>
    </div>
  )
}
