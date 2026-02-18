"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Lock, RefreshCw, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function NotFound() {
    const pathname = usePathname()
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUrl(window.location.href)
        }
    }, [])

    return (
        <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-background p-4 text-center">

            {/* Browser Window Simulation */}
            <div className="w-full max-w-2xl overflow-hidden rounded-xl border bg-card shadow-xl animation-all duration-300 hover:shadow-2xl">
                {/* Browser Toolbar */}
                <div className="flex items-center gap-4 border-b bg-muted/30 p-3">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>

                    <div className="flex gap-3 text-muted-foreground/50">
                        <ChevronLeft className="h-4 w-4" />
                        <ChevronRight className="h-4 w-4" />
                        <RefreshCw className="h-3.5 w-3.5" />
                    </div>

                    {/* Address Bar */}
                    <div className="flex flex-1 items-center gap-2 rounded-md border bg-background/50 px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-background">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="flex-1 truncate font-mono text-xs text-muted-foreground/80 selection:bg-primary/20 selection:text-primary">
                            {url || `https://vextron.ai${pathname}`}
                        </span>
                        <X className="h-3.5 w-3.5 text-muted-foreground/50" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col items-center justify-center bg-card/50 py-20 px-6 backdrop-blur-sm">
                    <div className="relative mb-6 group">
                        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl transition-all duration-500 group-hover:bg-primary/20" />
                        <Search className="relative h-20 w-20 text-primary transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
                    </div>

                    <h1 className="mb-2 text-4xl font-bold tracking-tight">Page not found</h1>
                    <p className="mb-8 max-w-md text-muted-foreground">
                        Oops! The page you're searching for seems to have vanished into the digital void.
                    </p>

                    <div className="flex gap-4">
                        <Button asChild variant="default" size="lg">
                            <Link href="/chat">
                                <Home className="mr-2 h-4 w-4" />
                                Go to Chat
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="lg">
                            <Link href="/">
                                Go Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-xs text-muted-foreground/40 font-mono">
                Error Code: 404_NOT_FOUND
            </div>
        </div>
    )
}
