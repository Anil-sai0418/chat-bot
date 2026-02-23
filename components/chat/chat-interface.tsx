"use client"

import * as React from "react"
import { ArrowUp, Bot, FileUp, Image as ImageIcon, ImagePlus, Loader2, LogOut, Mic, MoreVertical, Paperclip, Plus, Settings, Share2, Smile, StopCircle, User } from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export function ChatInterface() {
    const [messages, setMessages] = React.useState<Message[]>([])
    const [input, setInput] = React.useState("")
    const [isShareOpen, setIsShareOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const scrollAreaRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleNewChat = () => {
            setMessages([])
            setInput("")
            toast.success("Started a new chat")
        }

        window.addEventListener('new-chat', handleNewChat)
        return () => window.removeEventListener('new-chat', handleNewChat)
    }, [])

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages])

    const handleFileUpload = () => {
        toast.success("File uploaded successfully!")
    }

    const handleImageUpload = () => {
        toast.success("Image added to chat!")
    }

    const handleShare = () => {
        setIsShareOpen(false)
        toast.success("Link copied to clipboard!")
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        if (messages.length === 0) {
            window.dispatchEvent(new CustomEvent('add-chat', { detail: { title: input } }))
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        }

        const newMessages = [...messages, newMessage]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            })

            if (!response.ok) throw new Error("Failed to fetch response")
            if (!response.body) throw new Error("No response body")

            const reader = response.body.getReader()
            const decoder = new TextDecoder("utf-8")
            let done = false
            let aiResponseText = ""

            const aiMessageId = (Date.now() + 1).toString()

            setMessages((prev) => [...prev, {
                id: aiMessageId,
                role: "assistant",
                content: "",
                timestamp: new Date()
            }])

            while (!done) {
                const { value, done: readerDone } = await reader.read()
                done = readerDone
                if (value) {
                    const chunk = decoder.decode(value, { stream: true })
                    aiResponseText += chunk

                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === aiMessageId ? { ...msg, content: aiResponseText } : msg
                        )
                    )
                }
            }
        } catch (error) {
            toast.error("An error occurred while communicating with AI.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const renderInputBox = () => (
        <div className="relative flex flex-col rounded-xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Vextron..."
                className="min-h-[60px] w-full resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-4 pb-10"
                rows={1}
            />
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
                {/* Attach Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={handleFileUpload}>
                            <FileUp className="mr-2 h-4 w-4" />
                            Upload File
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleImageUpload}>
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Upload Image
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hidden sm:flex" onClick={handleImageUpload}>
                            <ImageIcon className="h-4 w-4" />
                            <span className="sr-only">Upload image</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upload image</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hidden sm:flex">
                            <Mic className="h-4 w-4" />
                            <span className="sr-only">Voice input</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice input</TooltipContent>
                </Tooltip>
            </div>
            <div className="absolute bottom-2 right-2">
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className={cn("h-8 w-8 rounded-lg transition-all", input.trim() && !isLoading ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                    <span className="sr-only">Send</span>
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <span className="text-sm font-medium text-muted-foreground">Vextron 1.0</span>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />

                    <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Share2 className="h-4 w-4" />
                                <span className="sr-only">Share</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Share chat</DialogTitle>
                                <DialogDescription>
                                    Anyone with the link will be able to view this chat.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                        Link
                                    </Label>
                                    <Input
                                        id="link"
                                        defaultValue="https://vextron.ai/chat/share/12345"
                                        readOnly
                                    />
                                </div>
                                <Button type="submit" size="sm" className="px-3" onClick={handleShare}>
                                    <span className="sr-only">Copy</span>
                                    Copy
                                </Button>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <div className="text-[0.8rem] text-muted-foreground">
                                    Link expires in 7 days.
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8 transition-opacity hover:opacity-80">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast.info("Navigating to Profile...")}>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Opening Settings...")}>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive mb-1" onClick={() => toast.error("Logged out")}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main Layout Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {messages.length === 0 ? (
                    /* Empty State: ChatGPT Style */
                    <div className="flex-1 flex flex-col items-center p-4 md:p-8 max-w-4xl mx-auto w-full h-full justify-center gap-8">
                        <div className="flex flex-col items-center gap-2 mt-auto mb-8">
                            <Avatar className="h-16 w-16 mb-4 bg-primary text-primary-foreground border-4 border-background shadow-lg">
                                <Bot className="h-8 w-8" />
                            </Avatar>
                            <h1 className="text-3xl font-semibold text-center tracking-tight">How can I help you today?</h1>
                            <p className="text-muted-foreground text-center">I can assist with coding, analysis, and creative tasks.</p>
                        </div>

                        <div className="w-full relative shadow-sm rounded-xl mb-4">
                            {renderInputBox()}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full mb-auto mt-4 px-2">
                            {[
                                { title: "Explain concepts", desc: "Quantum Computing for beginners", icon: "🧠" },
                                { title: "Draft an email", desc: "Requesting a deadline extension", icon: "✉️" },
                                { title: "Debug code", desc: "Find errors in python scripts", icon: "🐛" },
                                { title: "Brainstorm", desc: "Ideas for a new campaign", icon: "💡" }
                            ].map((card, i) => (
                                <Card
                                    key={i}
                                    className="p-4 cursor-pointer hover:bg-muted/50 transition-all border-muted-foreground/20 hover:border-primary/30 flex flex-col gap-2 shadow-sm"
                                    onClick={() => setInput(card.title + " - " + card.desc)}
                                >
                                    <div className="text-2xl">{card.icon}</div>
                                    <div>
                                        <h3 className="font-medium text-sm text-foreground">{card.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.desc}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Active Chat State */
                    <>
                        <ScrollArea className="flex-1 w-full min-h-0">
                            <div className="mx-auto max-w-4xl space-y-8 py-8 px-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex w-full items-start gap-4",
                                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <Avatar className={cn("h-8 w-8 border", message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                            {message.role === "assistant" ? (
                                                <Bot className="h-5 w-5" />
                                            ) : (
                                                <User className="h-5 w-5" />
                                            )}
                                        </Avatar>
                                        <div className={cn("flex max-w-[80%] flex-col gap-2", message.role === "user" ? "items-end" : "items-start")}>
                                            <div
                                                className={cn(
                                                    "rounded-2xl px-4 py-3 text-sm shadow-sm",
                                                    message.role === "user"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted border border-muted-foreground/10 text-foreground"
                                                )}
                                            >
                                                <div className={cn(
                                                    "prose max-w-none text-wrap dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
                                                    message.role === "user" ? "prose-p:text-primary-foreground text-primary-foreground" : "text-foreground"
                                                )}>
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollAreaRef} />
                            </div>
                        </ScrollArea>

                        <div className="w-full shrink-0 p-4 pt-2 border-t bg-background/95 backdrop-blur">
                            <div className="mx-auto max-w-4xl">
                                {renderInputBox()}
                                <p className="mt-2 text-center text-xs text-muted-foreground">
                                    Vextron can make mistakes. Consider checking important information.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
