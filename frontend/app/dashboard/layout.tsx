import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { cookies } from 'next/headers'
import DashboardSidebar from '../components/DashboardSidebar'
import { VideoDataProvider } from '../_context/VideoDataContext'

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true'

  return (
    <VideoDataProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar />

        <SidebarInset>
          <main className='p-4'>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </VideoDataProvider>
  )
}
