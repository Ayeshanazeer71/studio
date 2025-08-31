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
        <main className="bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
