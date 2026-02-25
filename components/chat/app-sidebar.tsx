"use client"

import * as React from "react"
import { MessageSquare, Plus, Settings, User, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function AppSidebar() {
    const [chatHistory, setChatHistory] = React.useState<any[]>([])
    const [query, setQuery] = React.useState("")
    const [debouncedQuery, setDebouncedQuery] = React.useState("")
    const [shortcut, setShortcut] = React.useState("Ctrl+K")
    const { isMobile, setOpenMobile } = useSidebar()

    const router = useRouter()
    const searchParams = useSearchParams()
    const activeChatId = searchParams?.get('id')

    const fetchChats = async () => {
        try {
            const res = await fetch(`${API_URL}/api/chats`)
            if (res.ok) {
                const data = await res.json()
                setChatHistory(data)
            }
        } catch (error) {
            console.error("Failed to fetch chats", error)
        }
    }

    React.useEffect(() => {
        fetchChats()

        const handleRefresh = () => fetchChats()
        window.addEventListener('refresh-chats', handleRefresh)
        return () => window.removeEventListener('refresh-chats', handleRefresh)
    }, [])

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query])

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
            setShortcut(isMac ? "⌘K" : "Ctrl+K")
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                const input = document.querySelector("[data-sidebar-search]") as HTMLInputElement
                if (input) {
                    input.focus()
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    const filteredHistory = React.useMemo(() => {
        let history = chatHistory
        if (debouncedQuery) {
            history = history.filter((item) =>
                item.title.toLowerCase().includes(debouncedQuery.toLowerCase())
            )
        }

        // Group by Today, Past 7 Days, Older
        const groups = [
            { label: "Recent", items: [] as any[] }
        ]

        history.forEach(chat => {
            groups[0].items.push(chat)
        })

        return groups.filter(g => g.items.length > 0)
    }, [debouncedQuery, chatHistory])

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                                <MessageSquare className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Vextron Chat</span>
                                <span className="truncate text-xs">Pro Plan</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <div className="px-2 py-1">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <SidebarInput
                            data-sidebar-search
                            placeholder="Search chats..."
                            className="pl-8 pr-12 bg-sidebar-accent/50 focus:bg-background transition-colors"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {!isMobile && (
                            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                {shortcut}
                            </kbd>
                        )}
                    </div>
                </div>

                <div className="px-2 pb-2">
                    <Button
                        className="w-full justify-start gap-2"
                        variant="outline"
                        onClick={() => {
                            router.push('/chat')
                            if (isMobile) {
                                setOpenMobile(false)
                            }
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {filteredHistory.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No chats found
                    </div>
                ) : (
                    filteredHistory.map((group) => (
                        <SidebarGroup key={group.label}>
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.id}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={activeChatId === item.id.toString()}
                                            >
                                                <button onClick={() => {
                                                    router.push(`/chat?id=${item.id}`)
                                                    if (isMobile) setOpenMobile(false)
                                                }}>
                                                    <MessageSquare className="mr-2 h-4 w-4 opacity-50" />
                                                    <span className="truncate">{item.title}</span>
                                                </button>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                )}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <User />
                            <span>User Profile</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Settings />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
