'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import ShortVideoGrid from './_components/ShortVideoGrid'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className='p-6'>
      <div className='flex justify-between'>
        <h1 className='mb-6 text-2xl font-bold'>Dashboard</h1>
        <Link href={'/dashboard/create-new'}>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' /> Create New Video
          </Button>
        </Link>
      </div>
      <ShortVideoGrid />
    </div>
  )
}
