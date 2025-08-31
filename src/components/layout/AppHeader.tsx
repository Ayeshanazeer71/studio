"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/url-scanner": "URL Scanner",
  "/apk-scanner": "APK Scanner",
  "/threat-feed": "Threat Feed",
}

export function AppHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Guardian Eye"

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </header>
  )
}
