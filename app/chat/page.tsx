import { AppSidebar } from "@/components/chat/app-sidebar"
import { ChatInterface } from "@/components/chat/chat-interface"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function ChatPage() {
    return (
        <SidebarProvider>
            <div className="flex w-full h-[100dvh] overflow-hidden bg-background">
                <AppSidebar />
                <main className="flex-1 min-w-0 h-full overflow-hidden">
                    <ChatInterface />
                </main>
            </div>
        </SidebarProvider>
    )
}
