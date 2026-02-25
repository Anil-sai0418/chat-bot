import { AppSidebar } from "@/components/chat/app-sidebar"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Suspense } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function ChatPage() {
    return (
        <SidebarProvider>
            <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading chat...</div>}>
                <div className="flex w-full h-[100dvh] overflow-hidden bg-background">
                    <AppSidebar />
                    <main className="flex-1 min-w-0 h-full overflow-hidden">
                        <ChatInterface />
                    </main>
                </div>
            </Suspense>
        </SidebarProvider>
    )
}
