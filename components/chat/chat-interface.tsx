"use client"

import * as React from "react"
import { ArrowUp, Bot, FileUp, Image as ImageIcon, ImagePlus, Loader2, LogOut, Mic, Plus, Settings, Share2, User } from "lucide-react"
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
import { useVoiceRecording } from "@/hooks/use-voice-recording"

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
    const [isVoiceOpen, setIsVoiceOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const scrollAreaRef = React.useRef<HTMLDivElement>(null)

    const handleVoiceTranscribe = async (audioBlob: Blob) => {
        try {
            // Placeholder for transcription
            // In production, send to Whisper API or similar
            toast.success("Audio recorded successfully!")
            // You can access the audio blob here to process it
            console.log("Audio blob size:", audioBlob.size)
            setIsVoiceOpen(false)
        } catch (error) {
            toast.error("Failed to process audio.")
            console.error(error)
        }
    }

    const { isRecording, recordingTime, startRecording, stopRecording } = useVoiceRecording(handleVoiceTranscribe)

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
        <div className="relative flex flex-col rounded-lg border border-muted-foreground/20 bg-background shadow-md focus-within:ring-1 focus-within:ring-primary/50">
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Vextron..."
                className="min-h-14 w-full resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-4 pb-12 text-sm"
                rows={1}
            />
            <div className="absolute bottom-2 left-3 flex items-center gap-1">
                {/* Attach Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50">
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add attachments</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem onClick={handleFileUpload} className="cursor-pointer">
                            <FileUp className="mr-2 h-4 w-4" />
                            Upload File
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleImageUpload} className="cursor-pointer">
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Upload Image
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 hidden sm:flex" onClick={handleImageUpload}>
                            <ImageIcon className="h-4 w-4" />
                            <span className="sr-only">Upload image</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Upload image</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 hidden sm:flex"
                            onClick={() => setIsVoiceOpen(true)}
                        >
                            <Mic className="h-4 w-4" />
                            <span className="sr-only">Voice input</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Voice input</TooltipContent>
                </Tooltip>
            </div>
            <div className="absolute bottom-2 right-3">
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="sm"
                    className={cn(
                        "h-7 w-7 rounded-md p-0 transition-all",
                        input.trim() && !isLoading
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex h-full flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="h-6 w-6" />
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <div className="flex items-center gap-2">
                        <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70 text-primary-foreground">
                            <Bot className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">Vextron 1.0</span>
                    </div>
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
                    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-3xl mx-auto w-full">
                        <div className="flex flex-col items-center gap-4 mb-12 text-center">
                            <div className="h-20 w-20 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                                <Bot className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight mb-2">How can I help you today?</h1>
                                <p className="text-muted-foreground text-lg">I can assist with coding, analysis, creative writing, and much more.</p>
                            </div>
                        </div>

                        <div className="w-full relative mb-8 max-w-2xl">
                            {renderInputBox()}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                            {[
                                { title: "Explain concepts", desc: "Quantum Computing for beginners", icon: "🧠" },
                                { title: "Draft an email", desc: "Requesting a deadline extension", icon: "✉️" },
                                { title: "Debug code", desc: "Find errors in python scripts", icon: "🐛" },
                                { title: "Brainstorm ideas", desc: "Ideas for a new campaign", icon: "💡" }
                            ].map((card, i) => (
                                <Card
                                    key={i}
                                    className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/40 flex flex-col gap-3"
                                    onClick={() => setInput(card.title + " - " + card.desc)}
                                >
                                    <div className="text-2xl">{card.icon}</div>
                                    <div>
                                        <h3 className="font-medium text-sm text-foreground">{card.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{card.desc}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Active Chat State */
                    <>
                        <div className="min-h-0 flex-1 overflow-hidden">
                            <ScrollArea className="h-full w-full">
                                <div className="mx-auto max-w-3xl space-y-6 py-8 px-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex w-full items-start gap-3",
                                                message.role === "user" ? "flex-row-reverse" : "flex-row"
                                            )}
                                        >
                                            <div className="shrink-0">
                                                <Avatar className={cn("h-8 w-8 border", message.role === "assistant" ? "bg-linear-to-br from-primary to-primary/70 text-primary-foreground" : "bg-muted/50 border-muted-foreground/20")}>
                                                    {message.role === "assistant" ? (
                                                        <Bot className="h-5 w-5" />
                                                    ) : (
                                                        <User className="h-5 w-5" />
                                                    )}
                                                </Avatar>
                                            </div>
                                            <div className={cn("flex flex-col gap-2 max-w-xl", message.role === "user" ? "items-end" : "items-start")}>
                                                <div
                                                    className={cn(
                                                        "rounded-xl px-4 py-2.5 text-sm",
                                                        message.role === "user"
                                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                                            : "bg-muted border border-muted-foreground/10 text-foreground rounded-bl-none"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "prose max-w-none prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
                                                        message.role === "user" ? "text-primary-foreground" : "text-foreground"
                                                    )}>
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {message.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-muted-foreground px-2">
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollAreaRef} />
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="w-full shrink-0 border-t bg-background p-4 backdrop-blur supports-backdrop-filter:bg-background/95">
                            <div className="mx-auto max-w-3xl space-y-3">
                                {renderInputBox()}
                                <p className="text-center text-xs text-muted-foreground">
                                    Vextron can make mistakes. Consider checking important information.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Voice Recording Modal */}
            <Dialog open={isVoiceOpen} onOpenChange={setIsVoiceOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Voice Input</DialogTitle>
                        <DialogDescription>
                            Click the button below to start recording your message
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col items-center gap-6 py-8">
                        {/* Visual Recording Indicator */}
                        <div className="flex flex-col items-center gap-4">
                            <div className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
                                isRecording 
                                    ? "bg-red-100 dark:bg-red-950 scale-110" 
                                    : "bg-primary/10 dark:bg-primary/20"
                            )}>
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center",
                                    isRecording
                                        ? "bg-red-500 animate-pulse"
                                        : "bg-primary"
                                )}>
                                    <Mic className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            
                            {isRecording && (
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-500">{recordingTime}s</p>
                                    <p className="text-sm text-muted-foreground mt-1">Recording in progress...</p>
                                </div>
                            )}
                            
                            {!isRecording && (
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Ready to record</p>
                                </div>
                            )}
                        </div>

                        {/* Waveform Visualization */}
                        {isRecording && (
                            <div className="flex items-center justify-center gap-1 w-full">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-primary rounded-sm transition-all"
                                        style={{
                                            width: "4px",
                                            height: `${20 + (i % 2) * 20}px`,
                                            animation: `wave 0.6s ease-in-out ${i * 0.1}s infinite`,
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 w-full">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    if (isRecording) {
                                        stopRecording()
                                    }
                                    setIsVoiceOpen(false)
                                }}
                            >
                                {isRecording ? "Cancel" : "Close"}
                            </Button>
                            <Button
                                className={cn(
                                    "flex-1",
                                    isRecording
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-primary hover:bg-primary/90"
                                )}
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? (
                                    <>
                                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                        Stop Recording
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-4 h-4 mr-2" />
                                        Start Recording
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    
                    <style>{`
                        @keyframes wave {
                            0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
                            50% { transform: scaleY(1); opacity: 1; }
                        }
                    `}</style>
                </DialogContent>
            </Dialog>
        </div>
    )
}
