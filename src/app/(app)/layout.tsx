import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="bg-background font-body relative">
            <div className="absolute inset-0 bg-cyberpunk-bg z-0" />
            <div className="relative z-10">
                {children}
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
