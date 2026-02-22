import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/ui/AppSidebar"
import { Map, LayoutDashboard } from "lucide-react"
import { title } from "process"

const items = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
   
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar items={items} />

      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}