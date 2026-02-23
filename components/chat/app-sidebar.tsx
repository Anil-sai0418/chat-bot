"use client"

import * as React from "react"
import { MessageSquare, Plus, Settings, User, Search } from "lucide-react"

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

// Dummy data for chat history
const initialHistory = [
    {
        label: "Today",
        items: [
            { title: "React Component Structure", url: "#" },
            { title: "Tailwind CSS Grid", url: "#" },
            { title: "Next.js Routing", url: "#" },
        ],
    },
    {
        label: "Yesterday",
        items: [
            { title: "AI Integration Guide", url: "#" },
            { title: "Database Schema Design", url: "#" },
        ],
    },
    {
        label: "Previous 7 Days",
        items: [
            { title: "Project Vextron Ideas", url: "#" },
            { title: "Debugging Auth Flow", url: "#" },
            { title: "Deployment Strategies", url: "#" },
        ],
    },
]

export function AppSidebar() {
    const [chatHistory, setChatHistory] = React.useState(initialHistory)
    const [query, setQuery] = React.useState("")
    const [debouncedQuery, setDebouncedQuery] = React.useState("")
    const [shortcut, setShortcut] = React.useState("Ctrl+K")
    const { isMobile, setOpenMobile } = useSidebar()

    React.useEffect(() => {
        const handleAddChat = (e: any) => {
            const title = e.detail?.title || "New Chat"
            const shortTitle = title.length > 25 ? title.substring(0, 25) + '...' : title
            setChatHistory(prev => {
                const todayGroupIndex = prev.findIndex(g => g.label === "Today")
                if (todayGroupIndex >= 0) {
                    const newHistory = [...prev]
                    newHistory[todayGroupIndex] = {
                        ...newHistory[todayGroupIndex],
                        items: [{ title: shortTitle, url: "#" }, ...newHistory[todayGroupIndex].items]
                    }
                    return newHistory
                }
                return [{ label: "Today", items: [{ title: shortTitle, url: "#" }] }, ...prev]
            })
        }
        window.addEventListener('add-chat', handleAddChat)
        return () => window.removeEventListener('add-chat', handleAddChat)
    }, [])

    // Debounce search query
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query])

    // Handle keyboard shortcut and OS detection
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

    // Filter history based on debounced query
    const filteredHistory = React.useMemo(() => {
        if (!debouncedQuery) return chatHistory

        return chatHistory
            .map((group) => ({
                ...group,
                items: group.items.filter((item) =>
                    item.title.toLowerCase().includes(debouncedQuery.toLowerCase())
                ),
            }))
            .filter((group) => group.items.length > 0)
    }, [debouncedQuery])

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
                            window.dispatchEvent(new CustomEvent('new-chat'))
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
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <a href={item.url}>
                                                    <MessageSquare className="mr-2 h-4 w-4 opacity-50" />
                                                    <span>{item.title}</span>
                                                </a>
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
