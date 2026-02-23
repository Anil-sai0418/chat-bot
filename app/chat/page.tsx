import { AppSidebar } from "@/components/chat/app-sidebar"
import { ChatInterface } from "@/components/chat/chat-interface"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function ChatPage() {
    return (
        <SidebarProvider>
            <div className="flex w-full h-screen overflow-hidden bg-background">
                <AppSidebar />
                <main className="flex-1 min-w-0 h-full overflow-hidden">
                    <ChatInterface />
                </main>
            </div>
        </SidebarProvider>
    )
}
