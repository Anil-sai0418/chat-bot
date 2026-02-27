"use client"

import * as React from "react"
import { ArrowUp, Bot, FileUp, Image as ImageIcon, ImagePlus, Loader2, LogOut, Mic, MicOff, MoreVertical, Paperclip, Plus, Settings, Share2, Smile, StopCircle, User } from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useRouter, useSearchParams } from "next/navigation"

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
import { useAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

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
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const imageInputRef = React.useRef<HTMLInputElement>(null)
    const [isListening, setIsListening] = React.useState(false)
    const [recognition, setRecognition] = React.useState<any>(null)
    const { token, user, logout } = useAuth()

    const router = useRouter()
    const searchParams = useSearchParams()
    const chatId = searchParams?.get('id')
    const isNewChatRef = React.useRef(false)

    // Fetch existing messages when chatId changes
    React.useEffect(() => {
        if (!chatId) {
            setMessages([])
            return
        }

        if (isNewChatRef.current) {
            // We just created this chat, skip fetching so we don't wipe optimistic UI
            isNewChatRef.current = false
            return
        }

        const fetchMessages = async () => {
            try {
                const res = await fetch(`${API_URL}/api/chats/${chatId}/messages`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (res.ok) {
                    const data = await res.json()
                    setMessages(data.map((msg: any) => ({
                        id: msg.id.toString(),
                        role: msg.role,
                        content: msg.content,
                        timestamp: new Date(msg.created_at)
                    })))
                } else {
                    toast.error("Failed to load conversation")
                }
            } catch (err) {
                console.error(err)
                toast.error("Failed to fetch messages")
            }
        }
        fetchMessages()
    }, [chatId])

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages])

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const rec = new SpeechRecognition();
                rec.continuous = false;
                rec.interimResults = false;

                rec.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(prev => prev + (prev.length > 0 ? ' ' : '') + transcript);
                    setIsListening(false);
                };

                rec.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    toast.error("Microphone error: " + event.error);
                    setIsListening(false);
                };

                rec.onend = () => {
                    setIsListening(false);
                };

                setRecognition(rec);
            }
        }
    }, []);

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    }

    const handleImageUpload = () => {
        imageInputRef.current?.click();
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            toast.success(`Attached ${file.name}`);
            setInput(prev => prev + `[File: ${file.name}] `);
            e.target.value = '';
        }
    }

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            toast.success(`Attached image ${file.name}`);
            setInput(prev => prev + `[Image: ${file.name}] `);
            e.target.value = '';
        }
    }

    const toggleMic = () => {
        if (!recognition) {
            toast.error("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            try {
                recognition.start();
                setIsListening(true);
                toast.info("Listening...");
            } catch (e) {
                // Ignore if it's already started
                setIsListening(false);
            }
        }
    }

    const handleShare = () => {
        setIsShareOpen(false)
        toast.success("Link copied to clipboard!")
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        let currentChatId = chatId
        const userInput = input

        // Optimistic UI update
        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userInput,
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, newMessage])
        setInput("")
        setIsLoading(true)

        try {
            // 1. Create chat if it doesn't exist
            if (!currentChatId) {
                const res = await fetch(`${API_URL}/api/chats`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title: userInput })
                })

                if (res.ok) {
                    const data = await res.json()
                    currentChatId = data.id.toString()
                    isNewChatRef.current = true
                    router.replace(`/chat?id=${currentChatId}`)
                    window.dispatchEvent(new CustomEvent('refresh-chats'))
                } else {
                    throw new Error("Failed to create chat")
                }
            }

            // 2. Prepare for Assistant Response Streaming
            const aiMessageId = (Date.now() + 1).toString()
            setMessages((prev) => [...prev, {
                id: aiMessageId,
                role: "assistant",
                content: "",
                timestamp: new Date()
            }])

            // 3. Send message to backend and stream response
            const response = await fetch(`${API_URL}/api/chats/${currentChatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userInput })
            })

            if (!response.ok) throw new Error("Failed to post message")
            if (!response.body) throw new Error("No response body")

            const reader = response.body.getReader()
            const decoder = new TextDecoder("utf-8")
            let done = false
            let aiResponseText = ""

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

            // Refresh sidebar to bump chat to top
            window.dispatchEvent(new CustomEvent('refresh-chats'))

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
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
            />
            <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={onImageChange}
                className="hidden"
            />
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Vextron..."
                className="min-h-[60px] w-full resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-4 pb-10"
                rows={1}
            />
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
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
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 rounded-full hidden sm:flex", isListening ? "text-red-500 hover:text-red-600 bg-red-500/10" : "text-muted-foreground hover:text-foreground")}
                            onClick={toggleMic}
                        >
                            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            <span className="sr-only">Voice input</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isListening ? "Stop listening" : "Voice input"}</TooltipContent>
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
                                        defaultValue={`https://vextron.ai/chat/share/${chatId || '12345'}`}
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
                                    <AvatarImage src={user?.profile_picture ? `http://localhost:8000${user.profile_picture}` : "https://github.com/shadcn.png"} alt="@user" />
                                    <AvatarFallback>{user ? `${user.first_name?.[0] || 'A'}${user.last_name?.[0] || 'S'}` : 'U'}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/profile")}>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsShareOpen(true)}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive mb-1" onClick={() => logout()}>
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
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                >
                                    <Card
                                        className="h-full p-4 cursor-pointer hover:bg-muted/50 transition-all border-muted-foreground/20 hover:border-primary/30 flex flex-col gap-2 shadow-sm"
                                        onClick={() => setInput(card.title + " - " + card.desc)}
                                    >
                                        <div className="text-2xl">{card.icon}</div>
                                        <div>
                                            <h3 className="font-medium text-sm text-foreground">{card.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.desc}</p>
                                        </div>
                                    </Card>
                                </motion.div>
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

                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex w-full items-start gap-4 flex-row"
                                    >
                                        <Avatar className="h-8 w-8 border bg-primary text-primary-foreground">
                                            <Bot className="h-5 w-5" />
                                        </Avatar>
                                        <div className="flex max-w-[80%] flex-col gap-2 items-start">
                                            <div className="rounded-2xl px-4 py-3.5 text-sm shadow-sm bg-muted border border-muted-foreground/10">
                                                <div className="flex space-x-1 items-center justify-center h-4">
                                                    <motion.div
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                                        className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                                                        className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                                                        className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

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
