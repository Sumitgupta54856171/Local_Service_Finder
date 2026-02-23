import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../ui/AppSidebar"
import FloatNav from "../ui/floadnav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      
      <FloatNav />

      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}